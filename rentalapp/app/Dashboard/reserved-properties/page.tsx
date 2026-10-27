// app/Dashboard/reserved-properties/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getReservedProperties, makeAvailable, markRented } from './action';
import DashboardLayout from '../DashboardLayout';
import { DAY_MS, RESERVATION_PRIORITY_DAYS } from '../../lib/config';

function statusOf(p: Awaited<ReturnType<typeof getReservedProperties>>[number]) {
  if (p.rentedAt) return { label: 'Rented', tone: 'bg-brand-100 text-brand-800' };
  const paidAt = p.orders[0]?.paidAt;
  if (!paidAt) return { label: 'Unavailable', tone: 'bg-gray-100 text-gray-700' };
  const ends = new Date(paidAt.getTime() + RESERVATION_PRIORITY_DAYS * DAY_MS);
  return {
    label: `Reserved until ${ends.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
    tone: 'bg-accent-100 text-accent-800',
  };
}

export default async function ReservedPropertiesPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const properties = await getReservedProperties();

  return (
    <DashboardLayout
      currentPage="reserved-properties"
      headerTitle="Reserved Properties"
      headerSubtitle={`Tenants get ${RESERVATION_PRIORITY_DAYS} days of priority. Mark a property rented, or it is re-listed automatically.`}
    >
      <div className="mx-auto max-w-5xl">
        {properties.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
            You have no reserved properties.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Property</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tenant</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map((p) => {
                  const tenant = p.orders[0];
                  const status = statusOf(p);
                  return (
                    <tr key={p.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {tenant ? (
                          <>
                            <p className="font-medium text-gray-800">{tenant.name}</p>
                            <a href={`mailto:${tenant.email}`} className="text-brand-700 hover:underline">{tenant.email}</a>
                            {tenant.phone && <p>{tenant.phone}</p>}
                          </>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.tone}`}>{status.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {!p.rentedAt && (
                            <form action={markRented.bind(null, p.id)}>
                              <button type="submit" className="btn btn-primary btn-sm">Mark rented</button>
                            </form>
                          )}
                          <form action={makeAvailable.bind(null, p.id)}>
                            <button type="submit" className="btn btn-outline btn-sm">Mark available</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
