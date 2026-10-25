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
  });
}

/* ---------------------------------------------------- */
/* 2.  MARK AVAILABLE  (agent-only)                    */
/* ---------------------------------------------------- */
export async function makeAvailable(propertyId: string) {
  const userId = await requireAgent();

  const { count } = await prisma.property.updateMany({
    where: { id: propertyId, agentId: userId },
    data: { isAvailable: true },
  });
  if (count === 0) throw new Error('Not your property');

  revalidatePath('/Dashboard/reserved-properties');
  revalidatePath('/Dashboard/properties');
  revalidatePath(`/properties/${propertyId}`);
}
