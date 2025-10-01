import Link from 'next/link';
import { XCircle, ArrowLeft, Home } from 'lucide-react';
import Header from '../../components/header'; 
import { prisma } from '../../lib/prisma';

export default async function CancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string, co?:string }>; 
}) {

  const orderId = (await searchParams).orderId?.toString();
  const co=(await searchParams).co?.toString();
  if(!orderId) return <p>Order ID is required.<br/> Please make sure you are actually on the right page.</p>

  await prisma.order.deleteMany({
    where: { id:co}
  })

  return (
    <>
      <Header />
      <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Cancelled</h1>
          <p className="mt-2 text-gray-600">
            Your payment process was cancelled. You have not been charged.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
           
              <Link
                href={`/properties/${orderId}`} 
                className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <ArrowLeft size={16} />
                Back to Property
              </Link>
            
            <Link
              href="/properties"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
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
