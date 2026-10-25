import Link from 'next/link';
import { XCircle, ArrowLeft, Home } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import Header from '../../components/header';
import { prisma } from '../../lib/prisma';

export const dynamic = 'force-dynamic';

export default async function CancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ co?: string; orderId?: string }>;
}) {
  const { co, orderId } = await searchParams;
  const { userId } = await auth();

  let propertyId = orderId ?? null;
  if (co && userId) {
    const order = await prisma.order.findFirst({
      where: { id: co, userId, status: 'pending' },
      select: { propertyId: true },
    });
    if (order) {
      propertyId = order.propertyId ?? propertyId;
      await prisma.order.updateMany({ where: { id: co, userId, status: 'pending' }, data: { status: 'cancelled' } });
    }
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Cancelled</h1>
          <p className="mt-2 text-gray-600">Your payment process was cancelled. You have not been charged.</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            {propertyId && (
              <Link
                href={`/properties/${propertyId}`}
                className="btn btn-outline w-full"
              >
                <ArrowLeft size={16} />
                Back to Property
              </Link>
            )}
            <Link
              href="/properties"
              className="btn btn-primary w-full"
            >
              <Home size={16} />
              Browse All Properties
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
