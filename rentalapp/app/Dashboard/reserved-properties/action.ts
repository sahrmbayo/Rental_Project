// app/Dashboard/reserved-properties/action.ts
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { requireAgent } from '../../lib/auth';

/* ---------------------------------------------------- */
/* 1.  LIST  (scoped to current agent)                 */
/* ---------------------------------------------------- */
export async function getReservedProperties() {
  const userId = await requireAgent();

  return prisma.property.findMany({
    where: { agentId: userId, isAvailable: false },
    orderBy: { postedAt: 'desc' },
    include: {
      orders: {
        where: { status: 'completed' },
        orderBy: { paidAt: 'desc' },
        take: 1,
        select: { name: true, email: true, phone: true, paidAt: true, outcome: true },
      },
    },
  });
}

function revalidateListing(propertyId: string) {
  revalidatePath('/Dashboard/reserved-properties');
  revalidatePath('/Dashboard/properties');
  revalidatePath(`/properties/${propertyId}`);
}

/* ---------------------------------------------------- */
/* 2.  MARK AVAILABLE  (agent-only)                    */
/* ---------------------------------------------------- */
export async function makeAvailable(propertyId: string) {
  const userId = await requireAgent();

  const { count } = await prisma.property.updateMany({
    where: { id: propertyId, agentId: userId },
    data: { isAvailable: true, rentedAt: null, confirmedAt: new Date(), expiryReminderSentAt: null },
  });
  if (count === 0) throw new Error('Not your property');

  await prisma.order.updateMany({
    where: { propertyId, status: 'completed', outcome: null },
    data: { outcome: 'relisted', relistedAt: new Date() },
  });

  revalidateListing(propertyId);
}

/* ---------------------------------------------------- */
/* 3.  MARK RENTED  (stops auto re-listing)            */
/* ---------------------------------------------------- */
export async function markRented(propertyId: string) {
  const userId = await requireAgent();

  const { count } = await prisma.property.updateMany({
    where: { id: propertyId, agentId: userId },
    data: { isAvailable: false, rentedAt: new Date() },
  });
  if (count === 0) throw new Error('Not your property');

  await prisma.order.updateMany({
    where: { propertyId, status: 'completed', outcome: null },
    data: { outcome: 'rented' },
  });

  revalidateListing(propertyId);
}
