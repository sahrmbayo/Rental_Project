"use server";

import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
const PAGE_SIZE = 6;

export async function fetchProperties({
  page = 1,
  city,
  type,
  price,
  bedrooms,
  electricity,
  amenities,
}: {
  page?: number | string;
  city?: string;
  type?: string;
  price?: string;
  bedrooms?: string;
  electricity?: string; // "true" if checked
  amenities?: string;
}) {
  const whereClause: any = {};

  if (city) whereClause.city = { equals: city, mode: "insensitive" };
  if (type) whereClause.propertyType = { equals: type, mode: "insensitive" };
  if (price && !isNaN(Number(price))) whereClause.price = { lte: Number(price) };
  if (bedrooms && !isNaN(Number(bedrooms))) whereClause.bedrooms = Number(bedrooms);
  if (electricity === "true") whereClause.electricity = true;

  if (amenities) {
    const wanted = amenities.split(",").map((a) => a.trim());
    if (wanted.length) whereClause.amenities = { some: { name: { in: wanted } } };
  }

  const [properties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where: whereClause,
      orderBy: { postedAt: "desc" },
      take: PAGE_SIZE,
      skip: (Number(page) - 1) * PAGE_SIZE,
      include: { amenities: true },
    }),
    prisma.property.count({ where: whereClause }),
  ]);

  return { properties, totalCount };
}
