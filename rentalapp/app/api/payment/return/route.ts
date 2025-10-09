import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');
  const co = searchParams.get('co');
  const status = searchParams.get('status'); // we'll add this in the URL

  if (!orderId || !co) {
    return NextResponse.json({ error: 'Missing orderId or co' }, { status: 400 });
  }

  // Optional: verify payment with Monime here if needed

  const basePath = status === 'cancel' ? '/checkout/cancelled' : '/checkout/success';
  const redirectUrl = new URL(basePath, req.nextUrl.origin);
  redirectUrl.searchParams.set('orderId', orderId);
  redirectUrl.searchParams.set('co', co);

  return NextResponse.redirect(redirectUrl, 302);
}