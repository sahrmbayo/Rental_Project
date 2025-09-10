// app/properties/[id]/edit/page.tsx
import { PrismaClient } from '../../../../generated/prisma';
import { notFound } from 'next/navigation';
import PropertyForm from '../../../../components/AddProperty';

/* ------------------------------------------------------------------ */
/* 1.  RUN PRISMA ONLY ON THE SERVER  (and disconnect when done)      */
/* ------------------------------------------------------------------ */
async function getProperty(id: string) {
  const prisma = new PrismaClient();
  try {
    const property = await prisma.property.findUnique({ where: { id } });
    return property; // null if not found
  } finally {
    await prisma.$disconnect();
  }
}

/* ------------------------------------------------------------------ */
/* 2.  PAGE COMPONENT – await params (Next.js 15 requirement)        */
/* ------------------------------------------------------------------ */
type Props = { params: Promise<{ id: string }> };

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params; // ← await the promise
  const property = await getProperty(id);

  if (!property) notFound();

  return <PropertyForm initialData={property} />;
}