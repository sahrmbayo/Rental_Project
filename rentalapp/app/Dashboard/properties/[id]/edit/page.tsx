// app/properties/[id]/edit/page.tsx

import { PrismaClient } from '../../../../generated/prisma';
import { notFound } from 'next/navigation';
import PropertyForm from '../../../../components/AddProperty'; // Adjust the import path as necessary

const prisma = new PrismaClient();

// Fetches the specific property data on the server
async function getProperty(id: string) {
  const property = await prisma.property.findUnique({
    where: { id },
  });
  console.log(`Fetching property for ID: ${id}`, property);
  return property;
}

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);

  // If the property doesn't exist for that ID, show a 404 page
  if (!property) {
    notFound();
  }

  return (
    // Your form will be rendered inside its own Layout component
    <PropertyForm initialData={property} />
  );
}