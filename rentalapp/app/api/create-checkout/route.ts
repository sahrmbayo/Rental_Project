import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../generated/prisma'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    // 1. Parse the body the UI sent
    const { name, orderId, lineItems, metadata, callbackState } = await req.json()

    // 2. Build safe, absolute redirect URLs
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!
    const successUrl = `${appUrl}/checkout/success?orderId=${encodeURIComponent(orderId)}`
    const cancelUrl  = `${appUrl}/checkout/cancelled?orderId=${encodeURIComponent(orderId)}`

    // 3. Create Monime Checkout Session
    const res = await fetch('https://api.monime.io/v1/checkout-sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MONIME_ACCESS_TOKEN}`,
        'Monime-Space-Id': process.env.MONIME_SPACE_ID!,
        'Idempotency-Key': randomUUID(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        successUrl,
        cancelUrl,
        lineItems,
        metadata,
        callbackState,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Monime error:', error)
      return NextResponse.json({ error }, { status: 500 })
    }

    const { result } = await res.json()          // { id, redirectUrl, ... }
    const checkoutSessionId = result.id

    // 4. Persist mapping (prevents 500 if order row is missing)
    await prisma.order.upsert({
      where: { id: orderId },
      update: { checkoutSessionId },
      create: { id: orderId, checkoutSessionId },
    })

    // 5. Send redirect URL to UI
    return NextResponse.json({ redirectUrl: result.redirectUrl })

  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}