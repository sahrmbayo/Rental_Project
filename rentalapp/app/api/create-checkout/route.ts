import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../generated/prisma'
import { randomUUID } from 'crypto'
import { clerkClient} from '@clerk/clerk-sdk-node'
import { auth } from '@clerk/nextjs/server'


const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await clerkClient.users.getUser(userId);
  const UOid = user.id;
  const UOemail = user.emailAddresses[0].emailAddress;
  const UOname = user.firstName + ' ' + user.lastName;
  const UOphone = user.phoneNumbers[0]?.phoneNumber || '';

  try {
    // 1. Parse the body the UI sent
    const { name, orderId, lineItems, metadata, callbackState } = await req.json()
    const created =prisma.order.create({
      data: {
        userId: UOid,
        email: UOemail,
        name: UOname,
        phone: UOphone,
        status: 'pending',
      },
    })

    const createdOrder = (await created).id

    // 2. Build safe, absolute redirect URLs
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!
    const successUrl = `${appUrl}/checkout?orderId=${encodeURIComponent(orderId)}&co=${createdOrder}`
    const cancelUrl  = `${appUrl}/checkout/cancelled?orderId=${encodeURIComponent(orderId)}&co=${createdOrder}`

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
    await prisma.order.update({
      where:{id:createdOrder},
      data:{checkoutSessionId}
    })
    // 5. Send redirect URL to UI
    return NextResponse.json({ redirectUrl: result.redirectUrl })

  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}