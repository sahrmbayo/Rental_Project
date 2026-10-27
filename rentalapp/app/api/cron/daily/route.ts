// Called once a day by Vercel Cron (see vercel.json). Vercel sends
// `Authorization: Bearer $CRON_SECRET`; other schedulers can do the same.
import { NextRequest, NextResponse } from 'next/server';
import { runDailyJobs } from '../../../lib/jobs';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const results = await runDailyJobs();
  return NextResponse.json({ ok: true, results });
}
