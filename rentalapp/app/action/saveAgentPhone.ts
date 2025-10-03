'use server';
import { prisma } from '../lib/prisma';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { auth } from '@clerk/nextjs/server';




export async function saveAgentPhone({
  agentId,
  phone,
}: {
  agentId: string;
  phone: string;
}) {
  const { userId } = await auth();
  const user = await clerkClient.users.getUser(userId);
  const email=user.emailAddresses[0].emailAddress
  const name=user.firstName+" "+user.lastName
 
  // 1.  store in your DB  (upsert so it works even if row doesn’t exist yet)
  await prisma.agent.upsert({
    where: { id: agentId },
    update: { phone },
    create: { id: agentId, phone, name: name, email: email },
  });

  // 2.  (optional) mirror to Clerk privateMetadata
  await clerkClient.users.updateUser(agentId, {
    privateMetadata: { phone },
  });

  return { ok: true };
}