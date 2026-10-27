import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { errorResponse, requireSuperAdmin } from '../../../lib/auth';
import { approveAgentApplication } from '../../../lib/agents';

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
      return NextResponse.json({ success: true });
    }

    const app = await prisma.agentApplication.findUnique({ where: { id } });
    if (!app) return NextResponse.json({ message: 'Application not found' }, { status: 404 });

    let result: 'promoted' | 'invited' | undefined;
    if (status === 'approved' && app.status !== 'approved') {
      result = await approveAgentApplication(app);
    }

    await prisma.agentApplication.update({ where: { id }, data: { status } });
    return NextResponse.json({ success: true, result });
  } catch (e) {
    return errorResponse(e, 'Could not update application');
  }
}
