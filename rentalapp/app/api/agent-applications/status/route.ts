import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { errorResponse, requireSuperAdmin } from '../../../lib/auth';

const STATUSES = ['pending', 'reviewed', 'approved', 'rejected'];

export async function PATCH(req: NextRequest) {
  try {
    await requireSuperAdmin();
    const { id, status } = await req.json();
    if (typeof id !== 'string' || !STATUSES.includes(status)) {
      return NextResponse.json({ message: 'Invalid id or status' }, { status: 400 });
    }

    if (status === 'rejected') {
      await prisma.agentApplication.delete({ where: { id } });
    } else {
      await prisma.agentApplication.update({ where: { id }, data: { status } });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return errorResponse(e, 'Server error');
  }
}
