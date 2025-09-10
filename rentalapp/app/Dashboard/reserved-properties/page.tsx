// app/dashboard/reserved-properties/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getReservedProperties, makeAvailable } from '../reserved-properties/action';
import DashboardLayout from '../DashboardLayout';

export default async function ReservedPropertiesPage() {
  // 1. Auth check (server-side)
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  // 2. Load agent’s reserved properties
  const properties = await getReservedProperties();

  return (
    <DashboardLayout 
    currentPage="reserved-properties"
     headerTitle="Reserved Properties"
     headerSubtitle="Manage your reserved property listings."
    >
    <div className="max-w-5xl mx-auto px-4 py-8">

      {properties.length === 0 ? (
        <p className="text-gray-800">You have no reserved properties</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Posted</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {properties.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-sm text-gray-900">{p.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(p.postedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  <form action={makeAvailable.bind(null, p.id)}>
                    <button
                      type="submit"
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Mark available
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </DashboardLayout>
  );
}