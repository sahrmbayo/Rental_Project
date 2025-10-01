'use server';
import { auth } from '@clerk/nextjs/server';

import { revalidatePath } from 'next/cache';

import { prisma } from '../lib/prisma';

export async function toggleFavorite(propertyId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const existing = await prisma.favourite.findUnique({
    where: { userId_propertyId: { userId, propertyId } },
  });

  if (existing) {
    await prisma.favourite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favourite.create({ data: { userId, propertyId } });
  }

  revalidatePath(`/properties/${propertyId}`);
  return { isFav: !existing };
}

export async function getFavoriteStatus(propertyId: string) {
  const { userId } = await auth();
  if (!userId) return false;
  const row = await prisma.favourite.findUnique({
    where: { userId_propertyId: { userId, propertyId } },
  });
  return !!row;
}

export async function getSavedProperties() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  return prisma.favourite.findMany({
    where: { userId },
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function removeFavorite(propertyId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await prisma.favourite.deleteMany({
    where: { userId, propertyId },
  });

  revalidatePath('/saved');
}