'use server';

import { headers } from 'next/headers';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../lib/prisma';
import { rateLimit } from '../lib/rateLimit';
import { sendEmail } from '../lib/email';
import { escapeHtml } from '../lib/escapeHtml';
import { ADMIN_EMAIL, getAppUrl } from '../lib/config';
import { REPORT_REASONS } from '../lib/reasons';

export async function reportListing(propertyId: string, reason: string, message: string) {
  const { userId } = await auth();
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
  if (!rateLimit(`report:${userId ?? ip}`, 5, 60 * 60 * 1000)) {
    return { ok: false as const, error: 'Too many reports. Please try again later.' };
  }

  if (!(reason in REPORT_REASONS)) return { ok: false as const, error: 'Choose a reason' };

  const property = await prisma.property.findUnique({ where: { id: propertyId }, select: { id: true, title: true } });
  if (!property) return { ok: false as const, error: 'Listing not found' };

  const text = message.trim().slice(0, 2000);
  await prisma.listingReport.create({ data: { propertyId, userId, reason, message: text || null } });

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `Listing reported – ${property.title}`,
    html: `
      <p>A listing was reported: <strong>${escapeHtml(REPORT_REASONS[reason as keyof typeof REPORT_REASONS])}</strong></p>
      ${text ? `<p>${escapeHtml(text).replace(/\n/g, '<br/>')}</p>` : ''}
      <p><a href="${getAppUrl()}/properties/${property.id}">${escapeHtml(property.title)}</a> · <a href="${getAppUrl()}/admin">Open admin</a></p>
    `,
  });

  return { ok: true as const };
}
