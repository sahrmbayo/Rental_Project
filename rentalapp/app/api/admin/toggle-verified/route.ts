import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { errorResponse, requireSuperAdmin } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    await requireSuperAdmin();
    const id = (await req.formData()).get('id');
    if (typeof id !== 'string' || !id) return NextResponse.json({ message: 'ID required' }, { status: 400 });

    const agent = await prisma.agent.findUnique({ where: { id }, select: { isVerified: true } });
    if (!agent) return NextResponse.json({ message: 'Agent not found' }, { status: 404 });

    await prisma.agent.update({ where: { id }, data: { isVerified: !agent.isVerified } });
    return NextResponse.redirect(new URL('/admin', req.url), 303);
  } catch (e) {
    return errorResponse(e);
  }
}
