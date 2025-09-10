// app/dashboard/reserved-properties/actions.ts
'use server';

import { PrismaClient } from '../../generated/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

/* ---------------------------------------------------- */
/* 1.  LIST  (scoped to current agent)                 */
/* ---------------------------------------------------- */
export  async function getReservedProperties() {
  const { userId } = await auth();        // ← moved inside
  if (!userId) throw new Error('Unauthorized');

  return prisma.property.findMany({
    where: { agentId: userId, isAvailable: false },
    orderBy: { postedAt: 'desc' },
  });
}

/* ---------------------------------------------------- */
/* 2.  MARK AVAILABLE  (agent-only)                    */
/* ---------------------------------------------------- */
export async function makeAvailable(propertyId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // verify ownership
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { agentId: true },
  });
  if (!property || property.agentId !== userId) {
    throw new Error('Not your property');
  }

  await prisma.property.update({
    where: { id: propertyId },
    data: { isAvailable: true },
  });

  revalidatePath('/dashboard/reserved-properties');
}