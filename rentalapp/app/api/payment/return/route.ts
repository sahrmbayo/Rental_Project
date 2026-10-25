import { NextRequest, NextResponse } from 'next/server';

// Monime sends the customer back here. Nothing is trusted from this URL:
// the /checkout page re-checks the session status with Monime.
function handle(req: NextRequest) {
  const co = req.nextUrl.searchParams.get('co');
  const status = req.nextUrl.searchParams.get('status');

  if (!co) return NextResponse.json({ error: 'Missing order reference' }, { status: 400 });

  const redirectUrl = new URL(status === 'cancel' ? '/checkout/cancelled' : '/checkout', req.nextUrl.origin);
  redirectUrl.searchParams.set('co', co);
  return NextResponse.redirect(redirectUrl, 303);
}

export const GET = handle;
export const POST = handle;
