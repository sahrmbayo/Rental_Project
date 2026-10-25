// app/Dashboard/properties/[id]/edit/page.tsx
import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../../../lib/prisma';
import { isSuperAdmin } from '../../../../lib/auth';
import PropertyForm from '../../../../components/AddProperty';

type Props = { params: Promise<{ id: string }> };

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const property = await prisma.property.findUnique({
    where: { id },
    include: { amenities: { select: { name: true } } },
  });

  if (!property || (property.agentId !== userId && !isSuperAdmin(userId))) notFound();

  return <PropertyForm initialData={property} />;
}
