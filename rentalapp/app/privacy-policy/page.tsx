import type { Metadata } from 'next';
import Header from '../components/header';
import BackToHomeButton from '../components/BackToHomeButton';

export const metadata: Metadata = {
  title: 'Privacy Policy | Salone Rent',
  description: 'Learn how Salone Rent handles your data and protects your privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
    <Header/>
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header Section */}
        <div className="rounded-2xl bg-white p-10 shadow-xl ring-1 ring-slate-100 transition hover:shadow-2xl">
          <div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Privacy Policy
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Last updated: October 09, 2025
              </p>
            </div>
            <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 sm:mt-0" />
          </div>

          <p className="text-lg leading-relaxed text-slate-700">
            Welcome to <span className="font-semibold text-indigo-600">Salone Rent</span>. We’re
            committed to protecting your personal information and your right to privacy. This policy
            explains what data we collect, how we use it, and your rights.
          </p>

          <div className="my-10 h-px w-full bg-gradient-to-r from-indigo-500/0 via-slate-200 to-indigo-500/0" />

          {/* Sections */}
          <Section
            number="1"
            title="Who We Are"
            content={
              <>
                Salone Rent (“we”, “us”, “our”) operates{' '}
                <a
                  href="https://www.salonerent.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  https://www.salonerent.com
                </a>
                , a rental marketplace for users in Sierra Leone.
              </>
            }
          />

          <Section
            number="2"
            title="Information We Collect"
            content={
              <>
                We only collect personal information that you provide directly when you create an
                account. This includes:
                <ul className="mt-4 space-y-3">
                  <ListItem label="Name" detail="Used to identify you within our service." />
                  <ListItem
                    label="Email Address"
                    detail="Used to communicate with you and secure your account."
                  />
                </ul>
                <p className="mt-4">
                  We <strong>do not</strong> collect phone numbers, ID documents, or payment data.
                  We also do not use analytics or tracking cookies.
                </p>
              </>
            }
          />

          <Section
            number="3"
            title="How and Why We Use Your Information"
            content={
              <>
                We use your information for:
                <ol className="mt-4 list-decimal list-inside space-y-2">
                  <li>
                    <strong>Account Management:</strong> We use Clerk Authentication to create and
                    manage your account.
                  </li>
                  <li>
                    <strong>Platform Protection:</strong> Helps prevent fraud and ensure a safe
                    community.
                  </li>
                  <li>
                    <strong>Communication:</strong> To send service messages and respond to your
                    inquiries.
                  </li>
                </ol>
                <p className="mt-4">
                  We never send marketing emails unless you opt in.
                </p>
              </>
            }
          />

          <Section
            number="4"
            title="Who We Share Your Information With"
            content={
              <>
                <p>
                  <strong>We never sell, rent, or trade your data.</strong>
                </p>
                <p className="mt-3">
                  We rely on trusted third-party providers like{' '}
                  <strong>Clerk Inc.</strong> (for authentication) and{' '}
                  <strong>PlanetScale, Inc.</strong> (for database hosting) to help us operate.
                </p>
              </>
            }
          />

          <Section
            number="5"
            title="How Long We Keep Your Information"
            content={
              <>
                We keep your data only as long as necessary:
                <ul className="mt-4 list-disc list-inside space-y-2">
                  <li>
                    Deleted accounts: data removed within <strong>30 days</strong>.
                  </li>
                  <li>
                    Inactive users: data removed after <strong>90 days</strong> of inactivity.
                  </li>
                </ul>
              </>
            }
          />

          <Section
            number="6"
            title="How to Contact Us"
            content={
              <>
                If you have questions or wish to exercise your rights, contact us at:{' '}
                <a
                  href="mailto:privacy@salonerent.com"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  privacy@salonerent.com
                </a>
                . We respond within 30 days.
              </>
            }
          />
          <BackToHomeButton />
          <div className="mt-12 h-px w-full bg-gradient-to-r from-indigo-500/0 via-slate-200 to-indigo-500/0" />

          <p className="mt-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Salone Rent. All rights reserved.
          </p>
        </div>
      </div>
    </main>
    </>
  );
}

/* === Reusable Section Component === */
function Section({
  number,
  title,
  content,
}: {
  number: string;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center text-2xl font-semibold text-slate-800">
        <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
          {number}
        </span>
        {title}
      </h2>
      <div className="mt-4 text-lg leading-relaxed text-slate-700">{content}</div>
    </section>
  );
}

/* === List Item Component === */
function ListItem({ label, detail }: { label: string; detail: string }) {
  return (
    <li className="flex items-start">
      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
      <span>
        <strong className="text-slate-800">{label}:</strong> {detail}
      </span>
    </li>
  );
}
