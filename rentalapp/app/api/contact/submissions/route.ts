// app/api/contact/submissions/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { errorResponse, requireSuperAdmin } from '../../../lib/auth';

export async function GET() {
  try {
    await requireSuperAdmin();
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(submissions);
  } catch (e) {
    return errorResponse(e, 'Failed to fetch submissions');
  }
}
