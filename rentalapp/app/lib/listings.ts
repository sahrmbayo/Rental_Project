import type { Prisma } from '../generated/prisma';
import { DAY_MS, LISTING_TTL_DAYS } from './config';

export type PropertySearchParams = {
  q?: string;
  city?: string;
  area?: string;
  type?: string;
  price?: string; // "25000" = up to, "50000+" = at least
  bedrooms?: string;
  electricity?: string; // "true" if checked
  amenities?: string; // comma separated
  sort?: string; // "newest" | "price_asc" | "price_desc"
};

export const SEARCH_PARAM_KEYS = ['q', 'city', 'area', 'type', 'price', 'bedrooms', 'electricity', 'amenities', 'sort'] as const;

export function listingExpiryCutoff(now = new Date()) {
  return new Date(now.getTime() - LISTING_TTL_DAYS * DAY_MS);
}

/** Listings the public may see: not rented out and confirmed by the agent recently. */
export function publicListingWhere(now = new Date()): Prisma.PropertyWhereInput {
  return { rentedAt: null, confirmedAt: { gte: listingExpiryCutoff(now) } };
}

export function pickSearchParams(input: Record<string, unknown>): PropertySearchParams {
  const out: PropertySearchParams = {};
  for (const key of SEARCH_PARAM_KEYS) {
    const v = input[key];
    if (typeof v === 'string' && v.trim()) out[key] = v.trim().slice(0, 100);
  }
  return out;
}

export function buildPropertyWhere(params: PropertySearchParams, now = new Date()): Prisma.PropertyWhereInput {
  const and: Prisma.PropertyWhereInput[] = [publicListingWhere(now)];
  const { q, city, area, type, price, bedrooms, electricity, amenities } = params;

  if (q) {
    and.push({
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { area: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
      ],
    });
  }
  if (city) and.push({ city: { equals: city, mode: 'insensitive' } });
  if (area) and.push({ area: { contains: area, mode: 'insensitive' } });
  if (type) and.push({ propertyType: { equals: type, mode: 'insensitive' } });

  if (price?.endsWith('+') && Number.isFinite(Number(price.slice(0, -1)))) {
    and.push({ price: { gte: Number(price.slice(0, -1)) } });
  } else if (price && Number.isFinite(Number(price))) {
    and.push({ price: { lte: Number(price) } });
  }

  if (bedrooms && Number.isInteger(Number(bedrooms))) and.push({ bedrooms: Number(bedrooms) });
  if (electricity === 'true') and.push({ electricity: true });

  if (amenities) {
    const wanted = amenities.split(',').map((a) => a.trim()).filter(Boolean).slice(0, 20);
    if (wanted.length) and.push({ amenities: { some: { name: { in: wanted } } } });
  }

  return { AND: and };
}

export function buildPropertyOrderBy(sort?: string): Prisma.PropertyOrderByWithRelationInput[] {
  if (sort === 'price_asc') return [{ price: 'asc' }, { postedAt: 'desc' }];
  if (sort === 'price_desc') return [{ price: 'desc' }, { postedAt: 'desc' }];
  return [{ postedAt: 'desc' }];
}

/** Human-readable summary of a search, e.g. "2 bed apartment in Freetown, up to NLe 25,000". */
export function describeSearch(p: PropertySearchParams) {
  const parts: string[] = [];
  if (p.bedrooms) parts.push(`${p.bedrooms} bed`);
  parts.push(p.type || 'property');
  if (p.area || p.city) parts.push(`in ${[p.area, p.city].filter(Boolean).join(', ')}`);
  let text = parts.join(' ');
  if (p.price?.endsWith('+')) text += `, from NLe ${Number(p.price.slice(0, -1)).toLocaleString()}`;
  else if (p.price) text += `, up to NLe ${Number(p.price).toLocaleString()}`;
  if (p.amenities) text += ` with ${p.amenities.split(',').join(', ')}`;
  if (p.electricity === 'true') text += ', electricity';
  if (p.q) text += ` matching "${p.q}"`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Deterministic offset (~300-600 m) so maps show the neighbourhood without
 * revealing the exact address before a tenant has paid.
 */
export function approximateLocation(id: string, lat: number, lng: number) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  const angle = ((h >>> 0) % 360) * (Math.PI / 180);
  const distanceKm = 0.3 + (((h >>> 8) % 300) / 1000);
  const dLat = (distanceKm / 111) * Math.cos(angle);
  const dLng = (distanceKm / (111 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle);
  return { lat: lat + dLat, lng: lng + dLng };
}
