import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { fullName, email, phone, yearsExperience, message } = body;

    if (!fullName || !email || !phone || !yearsExperience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const application = await prisma.agentApplication.create({
      data: {
        fullName,
        email,
        phone,
        yearsExperience: parseInt(yearsExperience),
        message,
      },
    });

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}