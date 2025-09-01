import { PrismaClient } from "../../generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const revalidate = 60;
export async function GET() {
    try {
    const totalProperties = await prisma.property.count();

    const totalAgents = await prisma.agent.count();

    const HeroStats = { totalProperties, totalAgents };

    
  return NextResponse.json(HeroStats);
    } catch (error) {
        console.error('[HERO_STATS_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

  
}
