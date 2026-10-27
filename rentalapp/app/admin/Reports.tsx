import Link from 'next/link';
import { prisma } from '../lib/prisma';
import { ISSUE_REASONS, REPORT_REASONS } from '../lib/reasons';
import ReportStatusSelect from './ReportStatusSelect';

const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

export default async function Reports() {
  const [listingReports, issues] = await Promise.all([
    prisma.listingReport.findMany({
      where: { status: { not: 'resolved' } },
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: { property: { select: { id: true, title: true } } },
    }),
    prisma.reservationIssue.findMany({
      where: { status: { not: 'resolved' } },
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: {
        order: {
          select: { name: true, email: true, property: { select: { id: true, title: true, agent: { select: { name: true, email: true } } } } },
        },
      },
    }),
  ]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Reservation problems <span className="text-sm font-normal text-gray-500">({issues.length} open)</span>
        </h2>
        {issues.length === 0 ? (
          <p className="text-sm text-gray-500">No open problems.</p>
        ) : (
          <ul className="divide-y">
            {issues.map((i) => (
              <li key={i.id} className="space-y-1 py-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-gray-900">
                    {ISSUE_REASONS[i.reason as keyof typeof ISSUE_REASONS] ?? i.reason}
                    <span className="ml-2 text-xs font-normal text-gray-400">{fmt(i.createdAt)}</span>
                  </p>
                  <ReportStatusSelect id={i.id} status={i.status} kind="reservation" />
                </div>
                <p className="whitespace-pre-wrap text-gray-700">{i.message}</p>
                <p className="text-xs text-gray-500">
                  Tenant {i.order.name} (<a className="text-brand-700" href={`mailto:${i.order.email}`}>{i.order.email}</a>)
                  {i.order.property && (
                    <>
                      {' · '}
                      <Link className="text-brand-700" href={`/properties/${i.order.property.id}`}>{i.order.property.title}</Link>
                      {' · '}Agent {i.order.property.agent.name} (
                      <a className="text-brand-700" href={`mailto:${i.order.property.agent.email}`}>{i.order.property.agent.email}</a>)
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Reported listings <span className="text-sm font-normal text-gray-500">({listingReports.length} open)</span>
        </h2>
        {listingReports.length === 0 ? (
          <p className="text-sm text-gray-500">No open reports.</p>
        ) : (
          <ul className="divide-y">
            {listingReports.map((r) => (
              <li key={r.id} className="space-y-1 py-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-gray-900">
                    <Link className="text-brand-700 hover:underline" href={`/properties/${r.property.id}`}>{r.property.title}</Link>
                    <span className="ml-2 text-xs font-normal text-gray-400">{fmt(r.createdAt)}</span>
                  </p>
                  <ReportStatusSelect id={r.id} status={r.status} kind="listing" />
                </div>
                <p className="text-gray-700">{REPORT_REASONS[r.reason as keyof typeof REPORT_REASONS] ?? r.reason}</p>
                {r.message && <p className="whitespace-pre-wrap text-gray-500">{r.message}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
