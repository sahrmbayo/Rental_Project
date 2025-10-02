import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get('agentId');

  if (!agentId) return NextResponse.json({ phone: null }, { status: 400 });

  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    select: { phone: true },
  });

  return NextResponse.json({ phone: agent?.phone ?? null });
}