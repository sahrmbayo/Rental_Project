'use server';
import { prisma } from '../lib/prisma';
import { clerkClient } from '@clerk/clerk-sdk-node';

export async function saveAgentPhone({
  agentId,
  phone,
}: {
  agentId: string;
  phone: string;
}) {
  // 1.  store in your DB  (upsert so it works even if row doesn’t exist yet)
  await prisma.agent.upsert({
    where: { id: agentId },
    update: { phone },
    create: { id: agentId, phone, name: '', email: '' },
  });

  // 2.  (optional) mirror to Clerk privateMetadata
  await clerkClient.users.updateUser(agentId, {
    privateMetadata: { phone },
  });

  return { ok: true };
}