'use server';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '../lib/prisma';
import { requireAgent } from '../lib/auth';

const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;

export async function saveAgentPhone({ phone }: { phone: string }) {
  const agentId = await requireAgent();

  const cleaned = String(phone ?? '').trim();
  if (!PHONE_RE.test(cleaned)) {
    return { ok: false as const, error: 'Please enter a valid phone number, e.g. +232 76 000000' };
  }

  const client = await clerkClient();
  const user = await client.users.getUser(agentId);
  const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || '';
  const name = user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ');

  await prisma.agent.upsert({
    where: { id: agentId },
    update: { phone: cleaned },
    create: { id: agentId, phone: cleaned, name, email },
  });

  await client.users.updateUser(agentId, { privateMetadata: { phone: cleaned } });

  return { ok: true as const };
}
