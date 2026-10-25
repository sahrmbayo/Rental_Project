import { Resend } from 'resend';
import { prisma } from './prisma';
import { getCheckoutSession } from './monime';
import { escapeHtml } from './escapeHtml';
import { EMAIL_FROM, SITE_NAME } from './config';

const resend = new Resend(process.env.RESEND_API_KEY);

export function whatsappLink(phone: string | null | undefined, agentName: string, propertyTitle: string) {
  const digits = (phone ?? '').replace(/\D/g, '');
  if (!digits) return null;
  const text = `Hello ${agentName}, I just reserved the property "${propertyTitle}" and would like to discuss.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

async function loadOrder(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          agent: { select: { name: true, email: true, phone: true } },
        },
      },
    },
  });
}

export type ConfirmedOrder = NonNullable<Awaited<ReturnType<typeof loadOrder>>>;

export type ConfirmResult =
  | { state: 'not-found' }
  | { state: 'pending' }
  | { state: 'not-paid' }
  | { state: 'paid'; order: ConfirmedOrder };

/**
 * Confirms an order against Monime. Only the first successful confirmation
 * reserves the property and sends emails, so reloading the page is safe.
 */
export async function confirmOrder(orderId: string, userId: string): Promise<ConfirmResult> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) return { state: 'not-found' };

  let firstConfirmation = false;

  if (order.status !== 'completed') {
    if (!order.checkoutSessionId) return { state: 'not-paid' };
    const session = await getCheckoutSession(order.checkoutSessionId);
    if (session.metadata?.orderDbId && session.metadata.orderDbId !== order.id) return { state: 'not-found' };
    if (session.status === 'pending') return { state: 'pending' };
    if (session.status !== 'completed') return { state: 'not-paid' };

    const propertyId = order.propertyId ?? session.metadata?.propertyId ?? null;
    const { count } = await prisma.order.updateMany({
      where: { id: order.id, OR: [{ status: null }, { status: { not: 'completed' } }] },
      data: { status: 'completed', paidAt: new Date(), propertyId },
    });
    firstConfirmation = count === 1;
    if (firstConfirmation && propertyId) {
      await prisma.property.updateMany({ where: { id: propertyId }, data: { isAvailable: false } });
    }
  } else if (!order.propertyId && order.checkoutSessionId) {
    // Orders created before propertyId existed: recover it from the session metadata.
    const session = await getCheckoutSession(order.checkoutSessionId);
    const propertyId = session.metadata?.propertyId;
    if (propertyId) {
      await prisma.order.update({ where: { id: order.id }, data: { propertyId } }).catch(() => {});
    }
  }

  const confirmed = await loadOrder(order.id);
  if (!confirmed?.property) return { state: 'not-found' };

  if (firstConfirmation) await sendConfirmationEmails(confirmed);

  return { state: 'paid', order: confirmed };
}

async function sendConfirmationEmails(order: ConfirmedOrder) {
  const { property } = order;
  if (!property) return;
  const { agent } = property;

  const title = escapeHtml(property.title);
  const wa = whatsappLink(agent.phone, agent.name, property.title);
  const phone = agent.phone ? escapeHtml(agent.phone) : 'Not provided';

  const results = await Promise.allSettled([
    resend.emails.send({
      from: EMAIL_FROM,
      to: order.email,
      subject: `Payment confirmed – ${property.title}`,
      html: `
        <p>Hi ${escapeHtml(order.name)},</p>
        <p>You just paid to unlock “${title}”. Contact the agent now:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:${escapeHtml(agent.email)}">${escapeHtml(agent.email)}</a></li>
          <li><strong>Phone:</strong> ${agent.phone ? `<a href="tel:${phone}">${phone}</a>` : phone}</li>
          ${wa ? `<li><strong>WhatsApp:</strong> <a href="${escapeHtml(wa)}">Chat on WhatsApp</a></li>` : ''}
        </ul>
        <p>Thank you for using ${SITE_NAME}!</p>
      `,
    }),
    resend.emails.send({
      from: EMAIL_FROM,
      to: agent.email,
      subject: `New payment – ${property.title}`,
      html: `
        <p>Hi ${escapeHtml(agent.name)},</p>
        <p>Someone paid to view “${title}”. The listing is now paused.</p>
      `,
    }),
  ]);
  results.forEach((r) => r.status === 'rejected' && console.error('Confirmation email failed:', r.reason));
}
