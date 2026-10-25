import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { clientIp, rateLimit } from '../../lib/rateLimit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`agent-app:${clientIp(req)}`, 3, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many applications. Please try again later.' }, { status: 429 });
    }

    const { fullName, email, phone, yearsExperience, message, website } = (await req.json()) ?? {};

    // Honeypot: real users never see or fill this field.
    if (website) return NextResponse.json({ success: true });

    const years = Number(yearsExperience);
    if (
      typeof fullName !== 'string' || !fullName.trim() || fullName.length > 100 ||
      typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 200 ||
      typeof phone !== 'string' || !phone.trim() || phone.length > 30 ||
      !Number.isInteger(years) || years < 0 || years > 80 ||
      (message && (typeof message !== 'string' || message.length > 5000))
    ) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    await prisma.agentApplication.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        yearsExperience: years,
        message: message || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
