// app/api/properties/[id]/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient, Property } from '../../../generated/prisma';

const prisma = new PrismaClient();

// --- DELETE Handler ---
// Handles requests like: DELETE /api/properties/some-property-id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: 'Property ID is required' },
      { status: 400 }
    );
  }

  try {
    // Use Prisma to delete the property with the matching ID
    await prisma.property.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: 'Property deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    // This will catch errors, e.g., if the property was already deleted
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { message: 'Error deleting property' },
      { status: 500 }
    );
  }
}

// Handles requests like: PATCH /api/properties/some-property-id
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await request.json() as Partial<Property>;

    const updatedProperty = await prisma.property.update({
      where: { id: id },
      data: body,
    });

    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { message: 'Error updating property' },
      { status: 500 }
    );
  }
}