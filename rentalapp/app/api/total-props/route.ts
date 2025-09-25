import { NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();


export const dynamic = 'force-static';


export const revalidate = false;

export async function GET() {
  try {
    const totalProperties = await prisma.property.count();
    const totalAgents     = await prisma.agent.count();

    return NextResponse.json({ totalProperties, totalAgents });
  } catch (err) {
    console.error('[HERO_STATS_GET]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
