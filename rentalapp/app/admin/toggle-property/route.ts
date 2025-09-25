// app/admin/toggle-property/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();
const SUPER_ADMIN_ID = process.env.SBM;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId || userId !== SUPER_ADMIN_ID) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const formData = await req.formData();
  const id = formData.get('id') as string;
  if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });

  try {
    const current = await prisma.property.findUnique({ where: { id }, select: { isAvailable: true } });
    if (!current) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    await prisma.property.update({
      where: { id },
      data: { isAvailable: !current.isAvailable },
    });
    return NextResponse.redirect(new URL('/admin', req.url)); // back to admin
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}