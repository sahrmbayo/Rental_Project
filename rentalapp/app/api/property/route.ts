import { PrismaClient } from '../../generated/prisma';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
   

    const user = await clerkClient.users.getUser(userId);
    const agentId = user.id;
    const agentName = user.fullName || user.firstName || '';
    const agentEmail = user.emailAddresses[0]?.emailAddress || '';
    const agentPhone = user.phoneNumbers[0]?.phoneNumber || '';

    const body = await req.json();

    const agent= await prisma.agent.upsert({
      where: { id: agentId },
      update: {},
      create: {
        id: agentId,
        name: agentName,
        email: agentEmail,
        phone: agentPhone,
      },
    });

    const property = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description || '',
        price: Number(body.price),
        propertyType: body.propertyType,
        landSize: Number(body.landSize),
        address: body.address,
        city: body.city,
        area: body.area,
        bedrooms: Number(body.bedrooms),
        bathrooms: Number(body.bathrooms),
        imageUrl: body.imageUrl || '',
        imageUr2: body.imageUr2 || '',
        agent: {
          connect: {
            id: agentId,
          },
        },
      },
    });

    return NextResponse.json({ property });
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: error.message || 'Failed to create property' }, { status: 500 });
  }
}
