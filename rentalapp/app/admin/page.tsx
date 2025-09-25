// app/admin/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminDashboard from './AdminDashboard';

// Replace with your own Clerk user ID
const SUPER_ADMIN_ID = process.env.SBM;

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId || userId !== SUPER_ADMIN_ID) redirect('/');
  return <AdminDashboard />;
}