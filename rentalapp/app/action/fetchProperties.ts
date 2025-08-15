'use server';

import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const PAGE_SIZE = 6; // This constant controls how many properties to load at a time

export async function fetchProperties({
  page = 1,
  city,
  type,
  price,
}: {
  page?: number;
  city?: string;
  type?: string;
  price?: string;
}) {
  const whereClause: any = {};
  if (city) whereClause.city = { equals: city, mode: 'insensitive' };
  if (type) whereClause.propertyType = { equals: type, mode: 'insensitive' };
  if (price && !isNaN(Number(price))) whereClause.price = { lte: Number(price) };

  const properties = await prisma.property.findMany({
    where: whereClause,
    orderBy: {
      postedAt: 'desc',
    },
    // These two lines are crucial for pagination
    take: PAGE_SIZE, // 1. Limit the query to 6 items
    skip: (page - 1) * PAGE_SIZE, // 2. Skip the items from previous pages
  });

  return properties;
}
