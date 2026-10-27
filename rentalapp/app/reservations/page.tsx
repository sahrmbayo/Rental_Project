import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import Header from '../components/header';
import { prisma } from '../lib/prisma';
import { whatsappLink } from '../lib/orders';
import { DAY_MS, PLACEHOLDER_IMAGE, RESERVATION_PRIORITY_DAYS, SITE_NAME } from '../lib/config';
import type { ImageAsset } from '../lib/propertySchema';
import { ISSUE_REASONS } from '../lib/reasons';
import { IssueForm, ReviewForm, StarRating } from './ReservationActions';

export const metadata: Metadata = { title: `My reservations | ${SITE_NAME}` };
export const dynamic = 'force-dynamic';

function priorityLabel(paidAt: Date | null, outcome: string | null) {
  if (outcome === 'rented') return { text: 'Rented to you', tone: 'bg-brand-100 text-brand-800' };
  if (!paidAt) return null;
  const ends = new Date(paidAt.getTime() + RESERVATION_PRIORITY_DAYS * DAY_MS);
  if (ends > new Date()) {
    return { text: `Priority until ${ends.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`, tone: 'bg-accent-100 text-accent-800' };
  }
  return { text: 'Priority period ended', tone: 'bg-gray-100 text-gray-600' };
}

export default async function ReservationsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in?redirect_url=/reservations');

  const orders = await prisma.order.findMany({
    where: { userId, status: 'completed' },
    orderBy: { paidAt: 'desc' },
    include: {
      review: true,
      issues: { orderBy: { createdAt: 'desc' }, take: 1 },
      property: {
        select: {
          id: true,
          title: true,
          images: true,
          address: true,
          area: true,
          city: true,
          agent: { select: { name: true, email: true, phone: true, isVerified: true } },
        },
      },
    },
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">My reservations</h1>
          <p className="mt-2 text-gray-600">Agent contact details for every property you have reserved.</p>

          {orders.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-gray-600">You haven&apos;t reserved any properties yet.</p>
              <Link href="/properties" className="btn btn-primary mt-6">Browse properties</Link>
            </div>
          ) : (
            <ul className="mt-8 space-y-6">
              {orders.map((order) => {
                const property = order.property;
                const agent = property?.agent;
                const badge = priorityLabel(order.paidAt, order.outcome);
                const issue = order.issues[0];
                const wa = agent ? whatsappLink(agent.phone, agent.name, property!.title) : null;
                const cover = (property?.images as ImageAsset[] | null)?.[0]?.url || PLACEHOLDER_IMAGE;

                return (
                  <li key={order.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative h-44 w-full shrink-0 sm:h-auto sm:w-56">
                        <Image src={cover} alt={property?.title ?? 'Removed property'} fill sizes="224px" className="object-cover" />
                      </div>
                      <div className="flex-1 space-y-4 p-5">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            {property ? (
                              <Link href={`/properties/${property.id}`} className="text-lg font-bold text-gray-900 hover:text-brand-700">
                                {property.title}
                              </Link>
                            ) : (
                              <p className="text-lg font-bold text-gray-500">Property removed</p>
                            )}
                            <p className="text-sm text-gray-500">
                              Reserved {order.paidAt?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                          {badge && <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.tone}`}>{badge.text}</span>}
                        </div>

                        {property && agent && (
                          <div className="grid gap-2 rounded-xl bg-gray-50 p-4 text-sm text-gray-700 sm:grid-cols-2">
                            <p className="flex items-center gap-2 font-semibold text-gray-900">
                              {agent.name}
                              {agent.isVerified && <ShieldCheck size={16} className="text-brand-600" aria-label="Verified agent" />}
                            </p>
                            <p className="flex items-center gap-2"><MapPin size={14} />{property.address}, {property.area}, {property.city}</p>
                            <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-brand-700 hover:underline"><Mail size={14} />{agent.email}</a>
                            {agent.phone && (
                              <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-brand-700 hover:underline"><Phone size={14} />{agent.phone}</a>
                            )}
                            {wa && (
                              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm w-fit sm:col-span-2">
                                💬 Chat on WhatsApp
                              </a>
                            )}
                          </div>
                        )}

                        <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            {order.review ? (
                              <div className="text-sm text-gray-600">
                                <p className="font-medium text-gray-700">Your rating</p>
                                <StarRating value={order.review.rating} />
                              </div>
                            ) : property ? (
                              <ReviewForm orderId={order.id} />
                            ) : null}
                          </div>
                          <div className="sm:text-right">
                            {issue && issue.status !== 'resolved' ? (
                              <p className="text-sm text-gray-600">
                                Problem reported: <strong>{ISSUE_REASONS[issue.reason as keyof typeof ISSUE_REASONS] ?? issue.reason}</strong>
                                <br />
                                <span className="text-xs uppercase tracking-wide text-accent-700">{issue.status}</span>
                              </p>
                            ) : (
                              <IssueForm orderId={order.id} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
