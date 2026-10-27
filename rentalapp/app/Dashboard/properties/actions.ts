'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { requireAgent } from '../../lib/auth';

/** Agent confirms the listing is still available, restarting its 30-day visibility. */
export async function confirmListing(propertyId: string) {
  const userId = await requireAgent();
  const { count } = await prisma.property.updateMany({
    where: { id: propertyId, agentId: userId },
    data: { confirmedAt: new Date(), expiryReminderSentAt: null },
  });
  if (count === 0) throw new Error('Not your property');
  revalidatePath('/Dashboard/properties');
  revalidatePath(`/properties/${propertyId}`);
}
