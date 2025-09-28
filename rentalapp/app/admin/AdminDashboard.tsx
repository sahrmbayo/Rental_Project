// app/admin/AdminDashboard.tsx
import { PrismaClient } from '../generated/prisma';
import LatestProperties from './LatestProperties';
import LatestAgents from './LatestAgent';
import ReservedProperties from './ReservedCount';

const prisma = new PrismaClient();

async function getStats() {
  const [userRows, agents, properties, reservations] = await Promise.all([
    prisma.favourite.groupBy({ by: ['userId'] }), // distinct userIds
    prisma.agent.count(),
    prisma.property.count(),
    prisma.order.count(),
  ]);
  return {
    users: userRows.length,
    agents,
    properties,
    reservations,
  };
}

async function getLatestProperties() {
  return prisma.property.findMany({
    orderBy: { postedAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      city: true,
      price: true,
      isAvailable: true,
    },
  });
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const latestProps = await getLatestProperties();

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage everything in one place.
        </p>

        {/* KPI row */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPI label="Total Users" value={stats.users} />
          <KPI label="Total Agents" value={stats.agents} />
          <KPI label="Total Properties" value={stats.properties} />
          <KPI label="Total Reservations" value={stats.reservations} />
        </div>

        {/* widgets */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Latest Properties
            </h2>
            <LatestProperties initialProps={latestProps} />
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Latest Agents
            </h2>
            <LatestAgents />
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Reserved Properties
            </h2>
            <ReservedProperties />
          </div>
        </div>
      </div>
    </main>
  );
}

function KPI({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white px-6 py-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
