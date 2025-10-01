// app/api/properties/[id]/route.ts

import { NextResponse } from 'next/server';
import {prisma} from '../../../lib/prisma';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



/* -------  GET  ------- */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: { amenities: true }, // ← brings amenities list
    });
    
    if (!property) return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    return NextResponse.json(property, { status: 200 });
  } catch (e) {
    console.error('GET property error:', e);
    return NextResponse.json({ message: 'Error fetching property' }, { status: 500 });
  }
}

/* -------  DELETE  ------- */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ message: 'Property ID required' }, { status: 400 });

  try {
    /* 1. fetch the property to get the public-ids */
    const property = await prisma.property.findUnique({
      where: { id },
      select: { images: true }, // images: Json → {url, publicId}[]
    });

    if (!property) return NextResponse.json({ message: 'Property not found' }, { status: 404 });

    /* 2. destroy each image in Cloudinary */
    const ids = (property.images as { publicId: string }[]) ?? [];
      await Promise.all(
        ids.map(({ publicId }) =>
          cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
        )
      );

    /* 3. delete the property row */
    await prisma.property.delete({ where: { id } });

    return NextResponse.json({ message: 'Property and images deleted' }, { status: 200 });
  } catch (e) {
    console.error('DELETE property error:', e);
    return NextResponse.json({ message: 'Error deleting property' }, { status: 500 });
  }
}

/* -------  PATCH  ------- */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  try {
    // disconnect old amenities, then save new
    await prisma.property.update({ where: { id }, data: { amenities: { set: [] } } });
    const updated = await prisma.property.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description || '',
        price: Number(body.price),
        propertyType: body.propertyType,
        landSize: Number(body.landSize || 0),
        address: body.address,
        city: body.city,
        area: body.area,
        bedrooms: Number(body.bedrooms),
        bathrooms: Number(body.bathrooms),
        electricity: Boolean(body.electricity),
        virtualTours: body.virtualTours || [],
        images: body.images || [],
        // connectOrCreate amenities
        amenities: {
          connectOrCreate: (body.amenities as string[]).map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: { amenities: true },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    console.error('PATCH property error:', e);
    return NextResponse.json({ message: 'Error updating property' }, { status: 500 });
  }
}