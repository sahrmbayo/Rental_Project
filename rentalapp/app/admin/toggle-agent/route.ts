import { clerkClient } from '@clerk/nextjs/server';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const SUPER_ADMIN_ID = process.env.SBM;

export async function POST(req: Request) {
  const { userId } = await auth();

  // 1. Authenticate the super admin
  if (!userId || userId !== SUPER_ADMIN_ID) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  // 2. Get the target user's ID
  const formData = await req.formData();
  const clerkUserId = formData.get('id') as string;
  if (!clerkUserId) {
    return NextResponse.json({ message: 'ID required' }, { status: 400 });
  }

  try {
    // 3. Get the user to check their current status
    const user = await (await clerkClient()).users.getUser(clerkUserId);
    const currentlyBanned = user.banned;

    // 4. Use the correct Clerk API methods to ban or unban
    if (currentlyBanned) {
      await (await clerkClient()).users.unbanUser(clerkUserId);
    } else {
      await (await clerkClient()).users.banUser(clerkUserId);
    }

    return NextResponse.redirect(new URL('/admin', req.url));
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}