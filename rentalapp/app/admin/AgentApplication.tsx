export const dynamic = 'force-dynamic';

import { prisma } from '../lib/prisma';
import StatusToggle from './StatusToggle';

export default async function AgentApplicationsWidget() {
  const apps = await prisma.agentApplication.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  if (apps.length === 0)
    return <p className="text-sm text-gray-500">No applications yet.</p>;

  return (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm text-left text-gray-600">
      <thead className="bg-gray-100 text-gray-700 uppercase text-[11px]">
        <tr>
          <th className="px-3 py-2">Name</th>
          <th className="px-3 py-2">Email</th>
          <th className="px-3 py-2">Phone</th>
          <th className="px-3 py-2">Exp.</th>
          <th className="px-3 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {apps.map((app) => (
          <tr key={app.id} className="border-b border-gray-100">
            <td className="px-3 py-3 font-medium text-gray-900">{app.fullName}</td>
            <td className="px-3 py-3">{app.email}</td>
            <td className="px-3 py-3">{app.phone}</td>
            <td className="px-3 py-3">{app.yearsExperience} yrs</td>
            <td className="px-3 py-3">
            <StatusToggle id={app.id} currentStatus={app.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
    );
}