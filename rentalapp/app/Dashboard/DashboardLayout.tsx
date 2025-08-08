'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building,
  PlusCircle,
  Settings,
  Bell,
  User,
  Menu,
  X,
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

// --- Reusable Sidebar Component Content ---
// This is defined inside the client component but doesn't use client features itself.
const SidebarContent = ({ currentPage }: { currentPage: 'dashboard' | 'properties' | 'add-property' |'setting' }) => (
  <div className="flex h-full flex-col">
    <div className="mb-10 flex items-center justify-between space-x-2 ">
      <div className='flex items-center space-x-2'>
      <Building className="h-8 w-8 text-blue-600" />
      <span className="text-xl font-bold text-gray-800">SL Rental</span>
      </div>
      <div className='md:hidden '>
        <UserButton />
      </div>
    </div>
    <nav className="flex-grow space-y-2">
      <Link
        href="/Dashboard"
        className={`flex items-center space-x-3 rounded-lg px-4 py-2.5 ${
          currentPage === 'dashboard'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <LayoutDashboard className="h-5 w-5" />
        <span className="font-medium">Dashboard</span>
      </Link>
      <Link
        href="/Dashboard/properties"
        className={`flex items-center space-x-3 rounded-lg px-4 py-2.5 ${
          currentPage === 'properties'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Building className="h-5 w-5" />
        <span className="font-medium">My Properties</span>
      </Link>
      <Link
        href="/Dashboard/add-property"
        className={`flex items-center space-x-3 rounded-lg px-4 py-2.5 ${
          currentPage === 'add-property'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <PlusCircle className="h-5 w-5" />
        <span className="font-medium">Add Property</span>
      </Link>
    </nav>
    <div>
      <Link href="Dashboard/settings" className="flex items-center space-x-3 rounded-lg px-4 py-2.5 text-gray-600 hover:bg-gray-100">
        <Settings className="h-5 w-5" />
        <span className="font-medium">Settings</span>
        
      </Link>
    </div>
  </div>
);

// --- Main Layout Component ---
export default function DashboardLayout({
  children,
  headerTitle,
  headerSubtitle,
  currentPage,
}: {
  children: React.ReactNode;
  headerTitle: string;
  headerSubtitle: string;
  currentPage: 'dashboard' | 'properties' | 'add-property'| 'setting';
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans w-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white p-4 lg:block">
        <SidebarContent currentPage={currentPage} />
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white p-4">
            <SidebarContent currentPage={currentPage} />
          </aside>
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="flex-1 bg-black opacity-50"
            aria-label="Close sidebar"
          ></div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          {/* Header */}
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                {headerTitle}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {headerSubtitle}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                aria-label="Open menu"
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
               <button className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 sm:block" aria-label="Notifications">
                <Bell className="h-6 w-6" />
              </button>
              <button className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 sm:block" aria-label="User profile">
                <UserButton/>
              </button>
            </div>
          </header>

          {/* Page-specific content goes here */}
          {children}
        </div>
      </main>
    </div>
  );
}
