import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { errorResponse, requireSuperAdmin } from '../../lib/auth';

export async function POST(req: Request) {
  try {
    const adminId = await requireSuperAdmin();

    const formData = await req.formData();
    const clerkUserId = formData.get('id');
    if (typeof clerkUserId !== 'string' || !clerkUserId) {
      return NextResponse.json({ message: 'ID required' }, { status: 400 });
    }
    if (clerkUserId === adminId) {
      return NextResponse.json({ message: 'You cannot ban yourself' }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(clerkUserId);
    if (user.banned) await client.users.unbanUser(clerkUserId);
    else await client.users.banUser(clerkUserId);

    return NextResponse.redirect(new URL('/admin', req.url), 303);
  } catch (e) {
    return errorResponse(e);
  }
}
