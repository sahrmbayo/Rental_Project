import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { ValidationError } from 'yup';
import { prisma } from '../../lib/prisma';
import { errorResponse, requireAgent } from '../../lib/auth';
import { IMAGE_SLOTS, parsePropertyBody } from '../../lib/propertySchema';

export async function POST(req: Request) {
  try {
    const agentId = await requireAgent();
    const { amenityNames, ...data } = await parsePropertyBody(await req.json(), {
      requireImages: IMAGE_SLOTS.length,
    });

    const user = await (await clerkClient()).users.getUser(agentId);
    await prisma.agent.upsert({
      where: { id: agentId },
      update: {},
      create: {
        id: agentId,
        name: user.fullName || user.firstName || '',
        email: user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || '',
      },
    });

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
