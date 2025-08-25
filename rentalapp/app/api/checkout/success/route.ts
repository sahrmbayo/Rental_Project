// // app/api/checkout/success/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { PrismaClient } from '../../../generated/prisma'

// const prisma = new PrismaClient()

// export async function GET(req: NextRequest) {
//   const token   = process.env.MONIME_ACCESS_TOKEN!
//   const spaceId = process.env.MONIME_SPACE_ID!

//   // 1. Pull orderId from the query string
//   const { searchParams } = new URL(req.url)
//   const orderId = searchParams.get('orderId')
//   if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })

//   // 2. Fetch the order and the stored checkoutSessionId
//   const order = await prisma.order.findUnique({
//     where: { id: orderId },
//     select: { checkoutSessionId: true },
//   })
//   if (!order?.checkoutSessionId)
//     return NextResponse.json({ error: 'Order or session not found' }, { status: 404 })

//   // 3. Verify the session with Monime
//   const res = await fetch(
//     `https://api.monime.io/v1/checkout-sessions/${order.checkoutSessionId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Monime-Space-Id': spaceId,
//       },
//     }
//   )

//   if (!res.ok) {
//     console.error('Monime lookup failed', await res.text())
//     return NextResponse.json({ error: 'Unable to verify payment' }, { status: 502 })
//   }

//   const { result } = await res.json() // { id, status, ... }
//   const monimeStatus = result.status // e.g. 'completed', 'processing', 'canceled'

//   // 4. Store final status (and anything else you need)
//   await prisma.order.update({
//     where: { id: orderId },
//     data: {
//       status: monimeStatus === 'completed' ? 'PAID' : monimeStatus,
//       paidAt: monimeStatus === 'completed' ? new Date() : null,
//     },
//   })

//   // 5. Redirect to your actual success page
//   const uiUrl = new URL(
//     `/checkout/success?orderId=${encodeURIComponent(orderId)}`,
//     process.env.APP_URL || 'http://localhost:3000'
//   )
//   return NextResponse.redirect(uiUrl)
// }