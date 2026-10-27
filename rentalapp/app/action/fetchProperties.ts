"use server";

import { prisma } from "../lib/prisma";
import {
  approximateLocation,
  buildPropertyOrderBy,
  buildPropertyWhere,
  pickSearchParams,
  type PropertySearchParams,
} from "../lib/listings";

const PAGE_SIZE = 6;

export type { PropertySearchParams };

const cardInclude = {
  amenities: { select: { name: true } },
  agent: { select: { isVerified: true } },
} as const;

export async function fetchProperties(input: PropertySearchParams & { page?: number | string }) {
  const params = pickSearchParams(input);
  const where = buildPropertyWhere(params);
  const pageNumber = Math.max(1, Math.floor(Number(input.page)) || 1);

  const [rows, totalCount] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: buildPropertyOrderBy(params.sort),
      take: PAGE_SIZE,
      skip: (pageNumber - 1) * PAGE_SIZE,
      include: cardInclude,
    }),
    prisma.property.count({ where }),
  ]);

  // Exact address and coordinates are only revealed after payment.
  const properties = rows.map(({ address: _address, latitude: _lat, longitude: _lng, ...p }) => p);

  return { properties, totalCount, pageSize: PAGE_SIZE };
}

/** Approximate pins for the map view (up to 300 matching listings). */
export async function fetchMapPins(input: PropertySearchParams) {
  const params = pickSearchParams(input);
  const rows = await prisma.property.findMany({
    where: { AND: [buildPropertyWhere(params), { latitude: { not: null } }, { longitude: { not: null } }] },
    orderBy: buildPropertyOrderBy(params.sort),
    take: 300,
    select: { id: true, title: true, price: true, city: true, isAvailable: true, latitude: true, longitude: true },
  });
  return rows.map(({ latitude, longitude, ...p }) => ({ ...p, ...approximateLocation(p.id, latitude!, longitude!) }));
}
