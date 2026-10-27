import { prisma } from './prisma';
import { getCheckoutSession } from './monime';
import { escapeHtml } from './escapeHtml';
import { sendEmail, emailButton } from './email';
import { sendText } from './sms';
import { RESERVATION_PRIORITY_DAYS, SITE_NAME, getAppUrl } from './config';

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
          address: true,
          area: true,
          city: true,
          agent: { select: { id: true, name: true, email: true, phone: true } },
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
 * Checks an order against Monime and, the first time it is seen as paid,
 * reserves the property and notifies both parties. Safe to call repeatedly
 * (checkout page, webhook, daily reconcile job).
 */
export async function confirmOrderPayment(orderId: string): Promise<ConfirmResult> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { state: 'not-found' };

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

  if (firstConfirmation) await notifyReservation(confirmed);

  return { state: 'paid', order: confirmed };
}

/** Same as confirmOrderPayment, but only for the tenant who placed the order. */
export async function confirmOrder(orderId: string, userId: string): Promise<ConfirmResult> {
  const owner = await prisma.order.findUnique({ where: { id: orderId }, select: { userId: true } });
  if (!owner || owner.userId !== userId) return { state: 'not-found' };
  return confirmOrderPayment(orderId);
}

async function notifyReservation(order: ConfirmedOrder) {
  const { property } = order;
  if (!property) return;
  const { agent } = property;

  const appUrl = getAppUrl();
  const title = escapeHtml(property.title);
  const wa = whatsappLink(agent.phone, agent.name, property.title);
  const phone = agent.phone ? escapeHtml(agent.phone) : 'Not provided';

  await Promise.all([
    sendEmail({
      to: order.email,
      subject: `Payment confirmed – ${property.title}`,
      html: `
        <p>Hi ${escapeHtml(order.name)},</p>
        <p>You just reserved “${title}”. You have <strong>${RESERVATION_PRIORITY_DAYS} days</strong> of priority to agree terms with the agent:</p>
        <ul>
          <li><strong>Agent:</strong> ${escapeHtml(agent.name)}</li>
          <li><strong>Email:</strong> <a href="mailto:${escapeHtml(agent.email)}">${escapeHtml(agent.email)}</a></li>
          <li><strong>Phone:</strong> ${agent.phone ? `<a href="tel:${phone}">${phone}</a>` : phone}</li>
          ${wa ? `<li><strong>WhatsApp:</strong> <a href="${escapeHtml(wa)}">Chat on WhatsApp</a></li>` : ''}
          <li><strong>Address:</strong> ${escapeHtml(property.address)}, ${escapeHtml(property.area)}, ${escapeHtml(property.city)}</li>
        </ul>
        ${emailButton(`${appUrl}/reservations`, 'View my reservations')}
        <p>Thank you for using ${SITE_NAME}!</p>
      `,
    }),
    sendEmail({
      to: agent.email,
      subject: `New reservation – ${property.title}`,
      html: `
        <p>Hi ${escapeHtml(agent.name)},</p>
        <p>${escapeHtml(order.name)} paid to reserve “${title}”. The listing is paused while you agree terms.</p>
        <p>If you rent it to them, mark it as rented. Otherwise it will be re-listed automatically after ${RESERVATION_PRIORITY_DAYS} days.</p>
        ${emailButton(`${appUrl}/Dashboard/reserved-properties`, 'Manage reservations')}
      `,
    }),
    sendText(
      order.phone,
      `${SITE_NAME}: You reserved "${property.title}". Agent ${agent.name}${agent.phone ? `, ${agent.phone}` : ''}, ${agent.email}. You have ${RESERVATION_PRIORITY_DAYS} days priority.`
    ),
    sendText(
      agent.phone,
      `${SITE_NAME}: ${order.name} reserved "${property.title}"${order.phone ? ` (${order.phone})` : ''}. Mark it rented or it re-lists in ${RESERVATION_PRIORITY_DAYS} days.`
    ),
  ]);
}
