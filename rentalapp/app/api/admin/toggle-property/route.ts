// app/api/admin/toggle-property/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { errorResponse, requireSuperAdmin } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    await requireSuperAdmin();
    const { id } = await req.json();
    if (typeof id !== 'string' || !id) {
      return NextResponse.json({ message: 'ID required' }, { status: 400 });
    }

    const current = await prisma.property.findUnique({
      where: { id },
      select: { isAvailable: true },
    });
    if (!current) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const updated = await prisma.property.update({
      where: { id },
      data: { isAvailable: !current.isAvailable },
      select: { id: true, isAvailable: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    return errorResponse(e);
  }
}
