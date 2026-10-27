'use server';

import { revalidatePath } from 'next/cache';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '../lib/prisma';
import { describeSearch, pickSearchParams, type PropertySearchParams } from '../lib/listings';

const MAX_SAVED = 10;

export async function saveSearch(input: PropertySearchParams) {
  const { userId } = await auth();
  if (!userId) return { ok: false as const, error: 'Please sign in to save searches' };

  const { sort: _sort, ...params } = pickSearchParams(input as Record<string, unknown>);
  if (Object.keys(params).length === 0) return { ok: false as const, error: 'Add at least one filter first' };

  const count = await prisma.savedSearch.count({ where: { userId } });
  if (count >= MAX_SAVED) return { ok: false as const, error: `You can save up to ${MAX_SAVED} searches` };

  const user = await (await clerkClient()).users.getUser(userId);
  const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;
  if (!email) return { ok: false as const, error: 'Your account needs an email address' };

  await prisma.savedSearch.create({
    data: { userId, email, params, label: describeSearch(params).slice(0, 120) },
  });
  revalidatePath('/saved');
  return { ok: true as const };
}

export async function deleteSavedSearch(id: string) {
  const { userId } = await auth();
  if (!userId) return;
  await prisma.savedSearch.deleteMany({ where: { id, userId } });
  revalidatePath('/saved');
}

export async function getSavedSearches() {
  const { userId } = await auth();
  if (!userId) return [];
  return prisma.savedSearch.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
}
