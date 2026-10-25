// app/properties/[id]/page.tsx
import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '../../lib/prisma';
import Header from '../../components/header';
import PropertyDetailsView from '../../components/PropertyDetailsView';
import { getFavoriteStatus } from '../../action/favourite';
import { RESERVATION_FEE_NLE, SITE_NAME } from '../../lib/config';
import type { ImageAsset } from '../../lib/propertySchema';

type Props = { params: Promise<{ id: string }> };

// Agent contact details are deliberately not loaded: they are only revealed after payment.
const getPropertyDetails = cache(async (id: string) =>
  prisma.property.findUnique({
    where: { id },
    include: { amenities: { select: { name: true } } },
  })
);

export type PropertyDetails = NonNullable<Awaited<ReturnType<typeof getPropertyDetails>>>;

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

  const initialFav = await getFavoriteStatus(property.id);

  return (
    <>
      <Header />
      <PropertyDetailsView property={property} initialFav={initialFav} reservationFee={RESERVATION_FEE_NLE} />
    </>
  );
}
