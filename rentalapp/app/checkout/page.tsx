// app/checkout/success/page.tsx
import { PrismaClient } from '../generated/prisma'
import { Resend } from 'resend'
import Link from 'next/link'

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY!)

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const { orderId } = await searchParams
  if (!orderId) return <p>Missing order ID.</p>

  /* --- same server-side logic you already have --- */
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'completed', paidAt: new Date() },
  })

  await prisma.property.update({
    where: { id: order.id },
    data: { isAvailable: false },
  })

  const property = await prisma.property.findUnique({
    where: { id: orderId },
    include: { agent: true },
  })

  await Promise.all([
    resend.emails.send({
      from: 'RentalApp <onboarding@resend.dev>',
      to: order.email,
      subject: `Payment confirmed – ${property.title}`,
      html: `Hi ${order.name},<br>You just paid to unlock “${property.title}”. Contact the agent now.<br/> Details:<br/>Email: ${property.agent.email}<br/>Phone: ${property.agent.phone}`,
    }),
    resend.emails.send({
      from: 'RentalApp <onboarding@resend.dev>',
      to: property.agent.email,
      subject: `New payment – ${property.title}`,
      html: `Hi ${property.agent.name},<br>Someone paid to view “${property.title}”. The listing is now paused.`,
    }),
  ])

  /* --- pure UI, cloned from Gemini screenshots --- */
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full text-center">
        {/* big green check */}
        <svg
          width="72"
          height="72"
          viewBox="0 0 24 24"
          className="mx-auto mb-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-slate-700 mb-6">
          Thank you, <strong>{order.name}</strong>! Your order has been
          confirmed.
          <br />
          We've sent a confirmation and the agent’s contact details to{' '}
          <strong>{order.email}</strong>.
        </p>

        {/* order summary card */}
        <div className="bg-slate-50 rounded-lg p-6 text-left text-sm text-slate-800 space-y-3 mb-6">
          <h2 className="font-bold text-base mb-1">Order Summary</h2>

          <div>
            <span className="font-semibold">Order ID:</span> {order.id}
          </div>
          <div>
            <span className="font-semibold">Paid For:</span> {property.title}
          </div>

          <div>
            <span className="font-semibold">Paid On:</span>{' '}
            {order.paidAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          <hr className="border-slate-200" />

          <h3 className="font-semibold mt-3">Next Steps: Contact the Agent</h3>

          <div className="pt-2">
            <div>
              <span className='font-semibold'>Agent Name:</span>{' '}
              {property.agent.name}
            </div>
            
            <br />
            <div>
              <span className='font-semibold'>Agent Email:</span>{' '}
              <a
              href={`mailto:${property.agent.email}`}
              className="text-blue-600 underline"
            >
              {property.agent.email}
            </a>
            </div>
            
            <br />
            <div>
              <span className='font-semibold'>Agent Phone:</span>{' '}
            <a
              href={`tel:${property.agent.phone}`}
              className="text-blue-600 underline"
            >
              {property.agent.phone}
            </a>
            </div>
          </div>
        </div>

        <Link
          href="/properties"
          className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-md shadow hover:bg-emerald-700 transition"
        >
          Continue Viewing Properties
        </Link>
      </div>
    </main>
  )
}