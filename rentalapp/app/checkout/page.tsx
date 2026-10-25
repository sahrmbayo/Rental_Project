// app/checkout/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { confirmOrder, whatsappLink } from '../lib/orders';

export const dynamic = 'force-dynamic';

function Notice({ title, body, retryHref }: { title: string; body: string; retryHref?: string }) {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
        <p className="text-slate-700 mb-6">{body}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {retryHref && (
            <Link href={retryHref} className="btn btn-primary">
              Check again
            </Link>
          )}
          <Link href="/properties" className="btn btn-outline">
            Browse properties
          </Link>
        </div>
      </div>
    </main>
  );
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ co?: string }>;
}) {
  const { co } = await searchParams;
  if (!co) return <Notice title="Missing order reference" body="Please use the link from your payment confirmation." />;

  const { userId } = await auth();
  if (!userId) redirect(`/sign-in?redirect_url=${encodeURIComponent(`/checkout?co=${co}`)}`);

  let result;
  try {
    result = await confirmOrder(co, userId);
  } catch (e) {
    console.error('Order confirmation failed:', e);
    return (
      <Notice
        title="We couldn't confirm your payment yet"
        body="Our payment provider didn't respond. If you were charged, your reservation will still go through — please check again in a minute."
        retryHref={`/checkout?co=${co}`}
      />
    );
  }

  if (result.state === 'not-found') {
    return <Notice title="Order not found" body="This order doesn't exist or belongs to another account." />;
  }
  if (result.state === 'pending') {
    return (
      <Notice
        title="Payment still processing"
        body="We haven't received confirmation from the payment provider yet. This usually takes a few seconds."
        retryHref={`/checkout?co=${co}`}
      />
    );
  }
  if (result.state === 'not-paid') {
    return <Notice title="Payment not completed" body="This payment was cancelled or expired. You have not been charged." />;
  }

  const { order } = result;
  const property = order.property!;
  const agent = property.agent;
  const wa = whatsappLink(agent.phone, agent.name, property.title);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full text-center">
        <svg
          width="72"
          height="72"
          viewBox="0 0 24 24"
          className="mx-auto mb-5 text-brand-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
        <p className="text-slate-700 mb-6">
          Thank you, <strong>{order.name}</strong>! Your order has been confirmed.
          <br />
          We&apos;ve sent a confirmation and the agent&apos;s contact details to <strong>{order.email}</strong>.
        </p>

        <div className="bg-slate-50 rounded-lg p-6 text-left text-sm text-slate-800 space-y-3 mb-6">
          <h2 className="font-bold text-base mb-1">Order Summary</h2>

          <div>
            <span className="font-semibold">Order ID:</span> {order.id}
          </div>
          <div>
            <span className="font-semibold">Paid For:</span> {property.title}
          </div>
          {order.paidAt && (
            <div>
              <span className="font-semibold">Paid On:</span>{' '}
              {order.paidAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          )}

          <hr className="border-slate-200" />

          <h3 className="font-semibold mt-3">Next Steps: Contact the Agent</h3>

          <div className="pt-2 space-y-3">
            <div>
              <span className="font-semibold">Agent Name:</span> {agent.name}
            </div>
            <div>
              <span className="font-semibold">Agent Email:</span>{' '}
              <a href={`mailto:${agent.email}`} className="text-brand-600 underline">
                {agent.email}
              </a>
            </div>
            <div>
              <span className="font-semibold">Agent Phone:</span>{' '}
              {agent.phone ? (
                <a href={`tel:${agent.phone}`} className="text-brand-600 underline">
                  {agent.phone}
                </a>
              ) : (
                'Not provided'
              )}
            </div>
            {wa && (
              <div>
                <span className="font-semibold">WhatsApp:</span>{' '}
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition text-sm"
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>

        <Link
          href="/properties"
          className="btn btn-primary btn-lg"
        >
          Continue Viewing Properties
        </Link>
      </div>
    </main>
  );
}
