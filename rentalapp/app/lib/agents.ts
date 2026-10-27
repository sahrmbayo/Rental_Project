import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from './prisma';
import { getAppUrl } from './config';

type Application = { email: string; fullName: string; phone: string };

/**
 * Makes an approved applicant an agent. Existing Clerk users are promoted
 * straight away; everyone else gets a Clerk invitation that grants the role on sign-up.
 */
export async function approveAgentApplication(app: Application): Promise<'promoted' | 'invited'> {
  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ emailAddress: [app.email], limit: 1 });
  const user = users[0];

  if (user) {
    await client.users.updateUserMetadata(user.id, { publicMetadata: { ...user.publicMetadata, role: 'admin' } });
    await prisma.agent.upsert({
      where: { id: user.id },
      update: { isVerified: true },
      create: {
        id: user.id,
        name: user.fullName || app.fullName,
        email: user.primaryEmailAddress?.emailAddress || app.email,
        phone: app.phone,
        isVerified: true,
      },
    });
    return 'promoted';
  }

  await client.invitations.createInvitation({
    emailAddress: app.email,
    publicMetadata: { role: 'admin' },
    redirectUrl: `${getAppUrl()}/sign-up`,
    notify: true,
    ignoreExisting: true,
  });
  return 'invited';
}

/** True if this email belongs to an approved agent application. */
export async function hasApprovedApplication(email: string) {
  if (!email) return false;
  const app = await prisma.agentApplication.findFirst({
    where: { email: { equals: email, mode: 'insensitive' }, status: 'approved' },
    select: { id: true },
  });
  return !!app;
}
