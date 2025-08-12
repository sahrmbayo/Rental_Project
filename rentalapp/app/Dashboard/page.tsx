'use client'; // This page is now a client component

import { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout'; // Your layout component
import { Database, TrendingUp, Users, PlusCircle } from 'lucide-react';
import Link from 'next/link';

// --- Reusable Stat Card Component ---
const StatCard = ({ icon: Icon, title, value, subtitle, isLoading }) => {
  if (isLoading) {
    // Show a loading skeleton
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
        <Icon className="h-6 w-6 text-blue-500" />
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
};

// --- Main Dashboard Page ---
export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function will run once when the component loads
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/dashboard-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
        // Optionally set an error state here
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []); 
  return (
    <DashboardLayout
      currentPage="dashboard"
      headerTitle="Dashboard"
      headerSubtitle={`Here's what's happening with your properties today. ${stats?.agentName}`}
    >

      {/* Action Buttons */}
          <div className="mb-8 flex flex-wrap gap-4">
            <Link href="/Dashboard/add-property" className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
              <PlusCircle size={18} />
              Add New Property
            </Link>
            <Link href="/Dashboard/properties" className="flex items-center gap-2 rounded-lg border bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
              View Properties
            </Link>
          </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Properties"
          value={stats?.totalProperties ?? '...'}
          icon={Database}
          subtitle="Your listings"
          isLoading={isLoading}
        />
        <StatCard
          title="New Inquiries"
          value={stats?.newInquiries ?? '...'}
          icon={Users}
          subtitle="This week"
          isLoading={isLoading}
        />
        <StatCard
          title="Revenue"
          value={stats ? `$${stats.totalRevenue.toLocaleString()}` : '...'}
          icon={TrendingUp}
          subtitle="This month"
          isLoading={isLoading}
        />
      </div>

      {/* Other dashboard content */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          <ul className="mt-4 space-y-3 text-sm text-gray-700">
             <li><Link href="/Dashboard/add-property" className="hover:text-blue-600">➕ Add a New Property</Link></li>
             <li><Link href="/Dashboard/properties" className="hover:text-blue-600">🗂 View Property List</Link></li>
          </ul>
        </div>
        
         <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                <li>📬 3 new inquiries received</li>
                <li>🏠 Property “Sunset Villa” added</li>
                <li>💰 Monthly revenue updated</li>
              </ul>
            </div>

      </div>
    </DashboardLayout>
  );
}