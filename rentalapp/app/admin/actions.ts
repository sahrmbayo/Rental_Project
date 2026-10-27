'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/prisma';
import { requireSuperAdmin } from '../lib/auth';
import { REPORT_STATUSES } from '../lib/reasons';

const valid = (s: string) => (REPORT_STATUSES as readonly string[]).includes(s);

export async function setListingReportStatus(id: string, status: string) {
  await requireSuperAdmin();
  if (!valid(status)) throw new Error('Invalid status');
  await prisma.listingReport.update({ where: { id }, data: { status } });
  revalidatePath('/admin');
}

export async function setReservationIssueStatus(id: string, status: string) {
  await requireSuperAdmin();
  if (!valid(status)) throw new Error('Invalid status');
  await prisma.reservationIssue.update({ where: { id }, data: { status } });
  revalidatePath('/admin');
}
