// app/properties/[id]/page.tsx
import { cache } from 'react';
import type { Metadata } from 'next';
import { after } from 'next/server';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../lib/prisma';
import Header from '../../components/header';
import PropertyDetailsView, { type ListingStatus } from '../../components/PropertyDetailsView';
import { getFavoriteStatus } from '../../action/favourite';
import { RESERVATION_FEE_NLE, SITE_NAME } from '../../lib/config';
import type { ImageAsset } from '../../lib/propertySchema';
import { approximateLocation, listingExpiryCutoff } from '../../lib/listings';

type Props = { params: Promise<{ id: string }> };

// Agent contact details are deliberately not loaded: they are only revealed after payment.
const getPropertyDetails = cache(async (id: string) =>
  prisma.property.findUnique({
    where: { id },
    include: { amenities: { select: { name: true } }, agent: { select: { isVerified: true } } },
  })
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyDetails(id);
  if (!property) return { title: `Property not found | ${SITE_NAME}` };

  const image = (property.images as ImageAsset[] | null)?.[0]?.url;
  const description =
    property.description?.slice(0, 160) ||
    `${property.bedrooms} bed, ${property.bathrooms} bath ${property.propertyType} in ${property.area}, ${property.city}.`;

  return {
    title: `${property.title} – ${property.city} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: property.title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;

  const property = await getPropertyDetails(id);
  if (!property) notFound();

  const [{ userId }, initialFav, rating] = await Promise.all([
    auth(),
    getFavoriteStatus(property.id),
    prisma.agentReview.aggregate({ where: { agentId: property.agentId }, _avg: { rating: true }, _count: true }),
  ]);

  if (userId !== property.agentId) {
    after(() => prisma.property.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {}));
  }

  const status: ListingStatus = property.rentedAt
    ? 'rented'
    : property.confirmedAt < listingExpiryCutoff()
      ? 'expired'
      : property.isAvailable
        ? 'available'
        : 'reserved';

  const { address: _address, latitude, longitude, agent, ...publicProperty } = property;
  const area = latitude != null && longitude != null ? approximateLocation(property.id, latitude, longitude) : null;

  return (
    <>
      <Header />
      <PropertyDetailsView
        property={publicProperty}
        initialFav={initialFav}
        reservationFee={RESERVATION_FEE_NLE}
        status={status}
        approxLocation={area}
        agent={{ isVerified: agent.isVerified, rating: rating._avg.rating, reviewCount: rating._count }}
      />
    </>
  );
}
