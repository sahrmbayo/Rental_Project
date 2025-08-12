import { PrismaClient } from '../../generated/prisma';
import { notFound } from 'next/navigation';
import Header from '../../components/header'; // Adjust path if needed
import PropertyDetailsView from '../../components/PropertyDetailsView'; // Import the client component

// --- Data Fetching (Server-Side) ---
const prisma = new PrismaClient();

async function getPropertyDetails(id: string) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      agent: true, // Include the related agent's details
    },
  });
  return property;
}

// --- Main Page Component (Server Component) ---
export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const property = await getPropertyDetails(params.id);

  // If no property is found, show a 404 page
  if (!property) {
    notFound();
  }

  return (
    <>
      <Header />
      {/* This page now only does two things:
        1. Fetches the data on the server.
        2. Renders the PropertyDetailsView Client Component, passing the data as a prop.
      */}
      <PropertyDetailsView property={property} />
    </>
  );
}
