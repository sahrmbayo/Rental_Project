// app/properties/[id]/page.tsx
import { PrismaClient } from '../../generated/prisma'; // adjust path if needed
import { notFound } from 'next/navigation';
import Header from '../../components/header';
import PropertyDetailsView from '../../components/PropertyDetailsView';
import { getFavoriteStatus } from '../../action/favourite';

const prisma = new PrismaClient();

async function getPropertyDetails(id: string) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: { agent: true },
  });
  return property;
}

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>; // <- params is a Promise
}) {
  const { id } = await params; // <- await it
  
  const property = await getPropertyDetails(id);
  const initialFav = await getFavoriteStatus(property.id);

  if (!property) {
    notFound();
  }

  return (
    <>
      <Header />
      <PropertyDetailsView property={property} initialFav={initialFav} />
    </>
  );
}