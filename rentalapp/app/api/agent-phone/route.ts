import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { errorResponse, requireAgent } from '../../lib/auth';

export async function GET() {
  try {
    const agentId = await requireAgent();
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: { phone: true },
    });
    return NextResponse.json({ phone: agent?.phone ?? null });
  } catch (e) {
    return errorResponse(e);
  }
}
