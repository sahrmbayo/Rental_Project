// app/api/dashboard-stats/route.ts
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '../../lib/prisma';
import { errorResponse, requireAgent } from '../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const agentId = await requireAgent();
    const user = await (await clerkClient()).users.getUser(agentId);

    const [totalProperties, reservedProperties, views, saves, recentReservations] = await Promise.all([
      prisma.property.count({ where: { agentId } }),
      prisma.property.count({ where: { agentId, isAvailable: false } }),
      prisma.property.aggregate({ where: { agentId }, _sum: { viewCount: true } }),
      prisma.favourite.count({ where: { property: { agentId } } }),
      prisma.order.findMany({
        where: { status: 'completed', property: { agentId } },
        orderBy: { paidAt: 'desc' },
        take: 5,
        select: { id: true, paidAt: true, name: true, property: { select: { id: true, title: true } } },
      }),
    ]);

    return NextResponse.json({
      agentName: user.fullName || user.firstName || '',
      totalProperties,
      reservedProperties,
      availableProperties: totalProperties - reservedProperties,
      totalViews: views._sum.viewCount ?? 0,
      totalSaves: saves,
      recentReservations,
    });
  } catch (e) {
    return errorResponse(e, 'Internal Server Error');
  }
}
