import type { Metadata } from 'next';
import Header from '../components/header';

export const metadata: Metadata = {
  title: 'Terms of Service | Salone Rent',
  description: 'Read the terms and conditions governing your use of Salone Rent.',
};

export default function TermsOfServicePage() {
  return (
    <>
    <Header />
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-2xl bg-white p-10 shadow-xl ring-1 ring-slate-100 transition hover:shadow-2xl">
          {/* Header */}
          <div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Terms of Service
              </h1>
              <p className="mt-2 text-sm text-slate-500">Last updated: October 09, 2025</p>
            </div>
            <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 sm:mt-0" />
          </div>

          <p className="text-lg leading-relaxed text-slate-700">
            Welcome to <span className="font-semibold text-indigo-600">Salone Rent</span>. By using
            our website, you agree to the following terms and conditions. Please read them carefully
            before using our platform.
          </p>

          <div className="my-10 h-px w-full bg-gradient-to-r from-indigo-500/0 via-slate-200 to-indigo-500/0" />

          {/* Sections */}
          <Section
            number="1"
            title="Acceptance of Terms"
            content={
              <>
                By accessing or using Salone Rent, you confirm that you have read, understood, and
                agreed to these Terms of Service and our{' '}
                <a
                  href="/privacy"
                  className="text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  Privacy Policy
                </a>
                . If you do not agree, you must stop using the site immediately.
              </>
            }
          />

          <Section
            number="2"
            title="Use of Our Platform"
            content={
              <>
                You agree to use Salone Rent only for lawful purposes. You must not:
                <ul className="mt-4 list-disc list-inside space-y-2">
                  <li>Post false or misleading listings.</li>
                  <li>Use another user’s account without permission.</li>
                  <li>Attempt to hack, disrupt, or exploit the platform.</li>
                </ul>
                <p className="mt-4">
                  We reserve the right to suspend or terminate any account that violates these
                  terms.
                </p>
              </>
            }
          />

          <Section
            number="3"
            title="User Accounts and Responsibilities"
            content={
              <>
                To list or rent properties, you must create an account. You are responsible for:
                <ul className="mt-4 list-disc list-inside space-y-2">
                  <li>Keeping your login credentials secure.</li>
                  <li>Ensuring all information you provide is accurate.</li>
                  <li>Immediately reporting unauthorized account access.</li>
                </ul>
              </>
            }
          />

          <Section
            number="4"
            title="Listings and Transactions"
            content={
              <>
                <p>
                  Property listings must be accurate, legal, and owned by you or by someone you
                  legally represent. We act as a platform connecting renters and property owners but
                  do not own, manage, or guarantee any property.
                </p>
                <p className="mt-4">
                  All communications and transactions between users are your sole responsibility.
                </p>
              </>
            }
          />

          <Section
            number="5"
            title="Intellectual Property"
            content={
              <>
                <p>
                  All content, trademarks, and logos on Salone Rent belong to us or our licensors.
                  You may not reproduce, distribute, or modify any part of our website without our
                  written permission.
                </p>
              </>
            }
          />

          <Section
            number="6"
            title="Limitation of Liability"
            content={
              <>
                <p>
                  Salone Rent is provided on an “as is” and “as available” basis. We are not liable
                  for any loss, damage, or dispute arising from your use of the platform, including
                  interactions between users or inaccurate listings.
                </p>
              </>
            }
          />

          <Section
            number="7"
            title="Termination"
            content={
              <>
                <p>
                  We reserve the right to suspend or terminate your account at any time if you
                  breach these terms or misuse the platform.
                </p>
              </>
            }
          />

          <Section
            number="8"
            title="Changes to These Terms"
            content={
              <>
                <p>
                  We may update these Terms of Service from time to time. The revised version will
                  be effective once posted on this page, with an updated “Last Updated” date.
                </p>
              </>
            }
          />

          <Section
            number="9"
            title="Contact Us"
            content={
              <>
                <p>
                  For questions about these terms, please email us at{' '}
                  <a
                    href="mailto:support@salonerent.com"
                    className="text-indigo-600 hover:text-indigo-500 hover:underline"
                  >
                    support@salonerent.com
                  </a>
                  .
                </p>
              </>
            }
          />

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
