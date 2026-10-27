// app/api/properties/[id]/route.ts
import { NextResponse } from 'next/server';
import { ValidationError } from 'yup';
import { prisma } from '../../../lib/prisma';
import { errorResponse, requirePropertyOwner } from '../../../lib/auth';
import { destroyImages } from '../../../lib/cloudinary';
import { parsePropertyBody, type ImageAsset } from '../../../lib/propertySchema';

type Ctx = { params: Promise<{ id: string }> };

/* -------  GET  ------- */
export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: { amenities: true },
    });

    if (!property) return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    return NextResponse.json(property, { status: 200 });
  } catch (e) {
    return errorResponse(e, 'Error fetching property');
  }
}

/* -------  DELETE  ------- */
export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    const { property } = await requirePropertyOwner(id);

    await prisma.property.delete({ where: { id } });

    const images = (property.images as ImageAsset[] | null) ?? [];
    await destroyImages(images.map((i) => i.publicId));

    return NextResponse.json({ message: 'Property and images deleted' }, { status: 200 });
  } catch (e) {
    return errorResponse(e, 'Error deleting property');
  }
}

/* -------  PATCH  ------- */
export async function PATCH(request: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    const { property } = await requirePropertyOwner(id);
    const { amenityNames, ...data } = await parsePropertyBody(await request.json(), { requireImages: 1 });

    const [, updated] = await prisma.$transaction([
      prisma.property.update({ where: { id }, data: { amenities: { set: [] } } }),
      prisma.property.update({
        where: { id },
        data: {
          ...data,
          confirmedAt: new Date(),
          expiryReminderSentAt: null,
          amenities: {
            connectOrCreate: amenityNames.map((name) => ({ where: { name }, create: { name } })),
          },
        },
        include: { amenities: true },
      }),
    ]);

    const kept = new Set(data.images.map((i) => i.publicId));
    const removed = ((property.images as ImageAsset[] | null) ?? []).filter((i) => !kept.has(i.publicId));
    await destroyImages(removed.map((i) => i.publicId));

    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    if (e instanceof ValidationError) {
      return NextResponse.json({ message: e.errors.join(', ') }, { status: 400 });
    }
    return errorResponse(e, 'Error updating property');
  }
}
