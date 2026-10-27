// Monime webhook. The payload is never trusted: we only use it to find the
// order, then confirmOrderPayment re-checks the session with Monime's API.
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { prisma } from '../../../lib/prisma';
import { confirmOrderPayment } from '../../../lib/orders';

type MonimeEvent = {
  event?: { name?: string };
  object?: { id?: string; type?: string };
  data?: { id?: string; reference?: string; metadata?: Record<string, string> | null };
};

function secretMatches(given: string | null) {
  const expected = process.env.MONIME_WEBHOOK_SECRET;
  if (!expected) return true;
  if (!given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  if (!secretMatches(req.nextUrl.searchParams.get('secret'))) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const payload = (await req.json().catch(() => null)) as MonimeEvent | null;
  if (!payload) return NextResponse.json({ message: 'Bad payload' }, { status: 400 });

  const isCheckout = payload.object?.type === 'checkout_session' || payload.event?.name?.startsWith('checkout_session.');
  if (!isCheckout) return NextResponse.json({ ignored: true });

  const sessionId = payload.object?.id ?? payload.data?.id;
  const orderId = payload.data?.metadata?.orderDbId ?? payload.data?.reference;

  const order = await prisma.order.findFirst({
    where: { OR: [...(sessionId ? [{ checkoutSessionId: sessionId }] : []), ...(orderId ? [{ id: orderId }] : [])] },
    select: { id: true },
  });
  if (!order) return NextResponse.json({ ignored: true });

  try {
    const result = await confirmOrderPayment(order.id);
    return NextResponse.json({ state: result.state });
  } catch (e) {
    console.error('Monime webhook confirm failed:', e);
    // 500 makes Monime retry later.
    return NextResponse.json({ message: 'Retry later' }, { status: 500 });
  }
}
