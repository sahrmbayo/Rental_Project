import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from './prisma';
import { getRole, isSuperAdmin } from './roles';

export { getRole, isSuperAdmin };

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new HttpError(401, 'Unauthorized');
  return userId;
}

export async function requireSuperAdmin() {
  const userId = await requireUserId();
  if (!isSuperAdmin(userId)) throw new HttpError(403, 'Forbidden');
  return userId;
}

export async function requireAgent() {
  const userId = await requireUserId();
  if ((await getRole(userId)) !== 'admin') throw new HttpError(403, 'Forbidden');
  return userId;
}

/** Throws unless the current user owns the property (or is the super admin). */
export async function requirePropertyOwner(propertyId: string) {
  const userId = await requireUserId();
  if (!isSuperAdmin(userId) && (await getRole(userId)) !== 'admin') {
    throw new HttpError(403, 'Forbidden');
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true, agentId: true, images: true },
  });
  if (!property) throw new HttpError(404, 'Property not found');
  if (property.agentId !== userId && !isSuperAdmin(userId)) {
    throw new HttpError(403, 'Not your property');
  }
  return { userId, property };
}

export function errorResponse(e: unknown, fallback = 'Internal server error') {
  if (e instanceof HttpError) {
    return NextResponse.json({ message: e.message }, { status: e.status });
  }
  console.error(e);
  return NextResponse.json({ message: fallback }, { status: 500 });
}
