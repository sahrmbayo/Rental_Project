// app/api/dashboard-stats/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = 'force-dynamic'; 
export async function GET() {
  try {
    
    const { userId } = await auth();
    const user = await clerkClient.users.getUser(userId);

    const agentName = user.fullName || user.firstName || '';

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    
    const totalProperties = await prisma.property.count({
      where: {
        agentId: userId,
      },
    });

    // You can add more queries here for other stats
    
    const reservedProperties = await prisma.property.count({
      where: {
        agentId: userId,
        isAvailable: false,
      },
    });
    const totalRevenue = 0; // Placeholder

    const stats = {
      totalProperties,
      reservedProperties,
      totalRevenue,
      agentName,
    };

    // 3. Return the data as JSON
    return NextResponse.json(stats);

  } catch (error) {
    console.error('[DASHBOARD_STATS_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}