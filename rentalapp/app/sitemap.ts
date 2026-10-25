import type { MetadataRoute } from 'next';
import { prisma } from './lib/prisma';
import { getAppUrl } from './lib/config';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getAppUrl();
  const properties = await prisma.property.findMany({
    select: { id: true, postedAt: true },
    orderBy: { postedAt: 'desc' },
    take: 5000,
  });

  const staticPages = ['', '/properties', '/about', '/contact', '/apply-as-agent', '/privacy-policy', '/terms-of-service'];

  return [
    ...staticPages.map((path) => ({ url: `${base}${path}`, changeFrequency: 'weekly' as const })),
    ...properties.map((p) => ({
      url: `${base}/properties/${p.id}`,
      lastModified: p.postedAt,
      changeFrequency: 'weekly' as const,
    })),
  ];
}
