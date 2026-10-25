"use server";

import { prisma } from "../lib/prisma";
import type { Prisma } from "../generated/prisma";

const PAGE_SIZE = 6;

export type PropertySearchParams = {
  page?: number | string;
  city?: string;
  type?: string;
  price?: string;
  bedrooms?: string;
  electricity?: string; // "true" if checked
  amenities?: string;
};

export async function fetchProperties({
  page = 1,
  city,
  type,
  price,
  bedrooms,
  electricity,
  amenities,
}: PropertySearchParams) {
  const where: Prisma.PropertyWhereInput = {};

  if (typeof city === "string" && city) where.city = { equals: city, mode: "insensitive" };
  if (typeof type === "string" && type) where.propertyType = { equals: type, mode: "insensitive" };
  if (typeof price === "string" && price.endsWith("+") && Number.isFinite(Number(price.slice(0, -1)))) {
    where.price = { gte: Number(price.slice(0, -1)) };
  } else if (price && Number.isFinite(Number(price))) {
    where.price = { lte: Number(price) };
  }
  if (bedrooms && Number.isInteger(Number(bedrooms))) where.bedrooms = Number(bedrooms);
  if (electricity === "true") where.electricity = true;

  if (typeof amenities === "string" && amenities) {
    const wanted = amenities.split(",").map((a) => a.trim()).filter(Boolean).slice(0, 20);
    if (wanted.length) where.amenities = { some: { name: { in: wanted } } };
  }

  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);

  const [properties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: { postedAt: "desc" },
      take: PAGE_SIZE,
      skip: (pageNumber - 1) * PAGE_SIZE,
      include: { amenities: true },
    }),
    prisma.property.count({ where }),
  ]);

  return { properties, totalCount, pageSize: PAGE_SIZE };
}
