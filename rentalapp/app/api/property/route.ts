import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { ValidationError } from 'yup';
import { prisma } from '../../lib/prisma';
import { errorResponse, requireAgent } from '../../lib/auth';
import { IMAGE_SLOTS, parsePropertyBody } from '../../lib/propertySchema';
import { hasApprovedApplication } from '../../lib/agents';

export async function POST(req: Request) {
  try {
    const agentId = await requireAgent();
    const { amenityNames, ...data } = await parsePropertyBody(await req.json(), {
      requireImages: IMAGE_SLOTS.length,
    });

    const user = await (await clerkClient()).users.getUser(agentId);
    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || '';
    const existingAgent = await prisma.agent.findUnique({ where: { id: agentId }, select: { id: true } });
    if (!existingAgent) {
      await prisma.agent.create({
        data: {
          id: agentId,
          name: user.fullName || user.firstName || '',
          email,
          isVerified: await hasApprovedApplication(email),
        },
      });
    }

    const property = await prisma.property.create({
      data: {
        ...data,
        agentId,
        amenities: {
          connectOrCreate: amenityNames.map((name) => ({ where: { name }, create: { name } })),
        },
      },
      include: { amenities: true },
    });

    return NextResponse.json({ property });
  } catch (e) {
    if (e instanceof ValidationError) {
      return NextResponse.json({ message: e.errors.join(', ') }, { status: 400 });
    }
    return errorResponse(e, 'Failed to create property');
  }
}
