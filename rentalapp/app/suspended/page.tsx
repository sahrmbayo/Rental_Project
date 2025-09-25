// app/suspended/page.tsx
export default function SuspendedPage() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-50">
      <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Account Suspended</h2>
        <p className="mt-2 text-gray-600">Contact support to re-instate your account.</p>
      </div>
    </main>
  );
}