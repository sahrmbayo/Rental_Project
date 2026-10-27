'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../lib/prisma';
import { sendEmail } from '../lib/email';
import { escapeHtml } from '../lib/escapeHtml';
import { ADMIN_EMAIL, getAppUrl } from '../lib/config';
import { ISSUE_REASONS } from '../lib/reasons';

type Result = { ok: boolean; error?: string };

async function ownCompletedOrder(orderId: string) {
  const { userId } = await auth();
  if (!userId) return null;
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId, status: 'completed' },
    include: { property: { select: { id: true, title: true, agentId: true } } },
  });
  return order ? { userId, order } : null;
}

export async function submitReview(orderId: string, rating: number, comment: string): Promise<Result> {
  const found = await ownCompletedOrder(orderId);
  if (!found) return { ok: false, error: 'Reservation not found' };
  const { userId, order } = found;
  if (!order.property) return { ok: false, error: 'This property has been removed' };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { ok: false, error: 'Choose 1 to 5 stars' };

  const existing = await prisma.agentReview.findUnique({ where: { orderId } });
  if (existing) return { ok: false, error: 'You already rated this agent' };

  await prisma.agentReview.create({
    data: {
      orderId,
      userId,
      agentId: order.property.agentId,
      rating,
      comment: comment.trim().slice(0, 1000) || null,
    },
  });

  revalidatePath('/reservations');
  revalidatePath(`/properties/${order.property.id}`);
  return { ok: true };
}

export async function reportReservationIssue(orderId: string, reason: string, message: string): Promise<Result> {
  const found = await ownCompletedOrder(orderId);
  if (!found) return { ok: false, error: 'Reservation not found' };
  const { userId, order } = found;

  if (!(reason in ISSUE_REASONS)) return { ok: false, error: 'Choose a reason' };
  const text = message.trim();
  if (text.length < 10) return { ok: false, error: 'Please describe the problem (at least 10 characters)' };

  const open = await prisma.reservationIssue.findFirst({ where: { orderId, status: { not: 'resolved' } } });
  if (open) return { ok: false, error: 'You already have an open report for this reservation' };

  const issue = await prisma.reservationIssue.create({
    data: { orderId, userId, reason, message: text.slice(0, 5000) },
  });

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `Reservation problem – ${order.property?.title ?? order.id}`,
    html: `
      <p><strong>${escapeHtml(order.name)}</strong> (${escapeHtml(order.email)}) reported a problem.</p>
      <p><strong>Reason:</strong> ${escapeHtml(ISSUE_REASONS[reason as keyof typeof ISSUE_REASONS])}</p>
      <p>${escapeHtml(text).replace(/\n/g, '<br/>')}</p>
      <p>Order ${order.id} · Issue ${issue.id}</p>
      <p><a href="${getAppUrl()}/admin">Open admin</a></p>
    `,
  });

  revalidatePath('/reservations');
  return { ok: true };
}
