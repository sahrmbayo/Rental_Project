// Kept free of Prisma imports so middleware (edge runtime) can use it.
import { auth, clerkClient } from '@clerk/nextjs/server';

type Claims = Record<string, unknown> | null | undefined;

export function isSuperAdmin(userId: string | null | undefined) {
  return !!userId && !!process.env.SBM && userId === process.env.SBM;
}

/**
 * Agents are Clerk users with `publicMetadata.role === 'admin'`.
 * Reads the role from session claims when the Clerk session token exposes
 * `metadata`, otherwise falls back to the Clerk API.
 */
export async function getRole(userId: string, sessionClaims?: Claims) {
  const claims = sessionClaims ?? (await auth()).sessionClaims;
  const claimRole = (claims?.metadata as { role?: string } | undefined)?.role;
  if (claimRole) return claimRole;
  const user = await (await clerkClient()).users.getUser(userId);
  return user.publicMetadata.role as string | undefined;
}
