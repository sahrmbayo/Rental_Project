'use client';

import { useState, useEffect, type ComponentType } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Database, CheckCircle2, PlusCircle, House } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { PhoneModal } from './phoneMedal';

type DashboardStats = {
  agentName: string;
  totalProperties: number;
  reservedProperties: number;
  availableProperties: number;
  recentReservations: {
    id: string;
    paidAt: string | null;
    name: string;
    property: { id: string; title: string } | null;
  }[];
};

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  isLoading,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  value: number | string;
  subtitle: string;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <Icon className="h-6 w-6 text-brand-500" />
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { user, isLoaded } = useUser();
  const [needsPhone, setNeedsPhone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/dashboard-stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        setStats(await response.json());
      } catch (error) {
        console.error(error);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isLoaded || !user) return;
    (async () => {
      const res = await fetch('/api/agent-phone');
      if (!res.ok) return;
      const { phone } = await res.json();
      setNeedsPhone(!phone);
    })();
  }, [isLoaded, user]);

  if (!isLoaded) return null;

  return (
    <DashboardLayout
      currentPage="dashboard"
      headerTitle={stats?.agentName ? `Welcome back, ${stats.agentName}` : 'Dashboard'}
      headerSubtitle="Here's what's happening with your properties today."
    >
      {needsPhone && <PhoneModal />}

      <div className="mb-8 flex flex-wrap gap-4">
        <Link href="/Dashboard/add-property" className="btn btn-primary">
          <PlusCircle size={18} />
          Add New Property
        </Link>
        <Link href="/Dashboard/properties" className="btn btn-outline">
          View Properties
        </Link>
      </div>

      {loadError && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          We couldn&apos;t load your stats. Please refresh the page.
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Properties" value={stats?.totalProperties ?? '–'} icon={Database} subtitle="Your listings" isLoading={isLoading} />
        <StatCard title="Available" value={stats?.availableProperties ?? '–'} icon={CheckCircle2} subtitle="Open for reservation" isLoading={isLoading} />
        <StatCard title="Reserved" value={stats?.reservedProperties ?? '–'} icon={House} subtitle="Awaiting agreement" isLoading={isLoading} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          <ul className="mt-4 space-y-3 text-sm text-gray-700">
            <li><Link href="/Dashboard/add-property" className="hover:text-brand-600">➕ Add a New Property</Link></li>
            <li><Link href="/Dashboard/properties" className="hover:text-brand-600">🗂 View Property List</Link></li>
            <li><Link href="/Dashboard/reserved-properties" className="hover:text-brand-600">🏠 Manage Reserved Properties</Link></li>
          </ul>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">Recent Reservations</h3>
          {isLoading ? (
            <p className="mt-4 text-sm text-gray-400">Loading…</p>
          ) : stats?.recentReservations.length ? (
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              {stats.recentReservations.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4">
                  <span>
                    <strong>{r.name}</strong> reserved{' '}
                    {r.property ? (
                      <Link href={`/properties/${r.property.id}`} className="text-brand-600 hover:underline">
                        {r.property.title}
                      </Link>
                    ) : (
                      'a deleted property'
                    )}
                  </span>
                  {r.paidAt && <span className="shrink-0 text-xs text-gray-400">{new Date(r.paidAt).toLocaleDateString()}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">No reservations yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
