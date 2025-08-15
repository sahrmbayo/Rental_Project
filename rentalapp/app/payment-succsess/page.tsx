import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import Header from '../components/header';

export default function PaymentSuccessPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[80vh] items-center justify-center bg-gray-50">
        <div className="max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="mt-2 text-gray-600">
            Your inquiry has been sent to the agent. They will contact you shortly to arrange a viewing.
          </p>
          <Link href="/properties" className="mt-6 inline-block w-full rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            Continue Browsing
          </Link>
        </div>
      </main>
    </>
  );
}
