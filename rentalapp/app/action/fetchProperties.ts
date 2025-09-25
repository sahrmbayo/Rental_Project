'use server';

import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const PAGE_SIZE = 6;

export async function fetchProperties({
  page = 1,
  city,
  type,
  price,
  bedrooms,     // NEW
  electricity,  // NEW
  amenities,    // NEW
}: {
  page?: number;
  city?: string;
  type?: string;
  price?: string;
  bedrooms?: string;
  electricity?: string;
  amenities?: string;
}) {
  const whereClause: any = {};
  if (city) whereClause.city = { equals: city, mode: 'insensitive' };
  if (type) whereClause.propertyType = { equals: type, mode: 'insensitive' };
  if (price && !isNaN(Number(price))) whereClause.price = { lte: Number(price) };

  // NEW filters
  if (bedrooms && !isNaN(Number(bedrooms))) whereClause.bedrooms = Number(bedrooms);
  if (electricity === 'true') whereClause.electricity = true;
  if (amenities) {
    const wanted = (amenities as string).split(',').filter((n) => !n.startsWith('bedrooms:'));
    if (wanted.length) whereClause.amenities = { some: { name: { in: wanted } } };
  }

  const properties = await prisma.property.findMany({
    where: whereClause,
    orderBy: { postedAt: 'desc' },
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    include: { amenities: true }, // ← brings amenities to card
  });

  return properties;
}