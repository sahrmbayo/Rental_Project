import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { errorResponse, requireSuperAdmin } from '../../../../lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireSuperAdmin();
    const { id } = await params;
    const { status } = await request.json();

    const numericId = Number(id);
    if (!Number.isInteger(numericId) || !['new', 'in-progress', 'resolved'].includes(status)) {
      return NextResponse.json({ message: 'Invalid id or status' }, { status: 400 });
    }

    const updatedSubmission = await prisma.contactSubmission.update({
      where: { id: numericId },
      data: { status },
    });

    return NextResponse.json(updatedSubmission);
  } catch (e) {
    return errorResponse(e, 'Failed to update submission');
  }
}
