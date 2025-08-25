// app/checkout/success/page.tsx
import { PrismaClient } from '../generated/prisma'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string }
}) {
  const orderId = searchParams.orderId
  if (!orderId) return <p>Missing order ID.</p>

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, paidAt: true },
  })

  if (!order) return <p>Order not found.</p>

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Payment successful!</h1>
      <p>Order #{order.id}</p>
      <p>Status: {order.status}</p>
      {order.paidAt && (
        <p>Paid at: {new Date(order.paidAt).toLocaleString()}</p>
      )}
      <Link href="/" className="underline mt-6 block">
        Back to shop
      </Link>
    </main>
  )
}