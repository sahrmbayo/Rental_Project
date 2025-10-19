import type { Metadata } from 'next';
import Header from '../components/header';
import BackToHomeButton from '../components/BackToHomeButton';

export const metadata: Metadata = {
  title: 'About Us | Salone Rent',
  description: 'Learn more about Salone Rent — the trusted home rental platform in Sierra Leone.',
};

export default function AboutPage() {
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
                About Us
              </h1>
              <p className="mt-2 text-sm text-slate-500">Get to know Salone Rent</p>
            </div>
            <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 sm:mt-0" />
          </div>

          <p className="text-lg leading-relaxed text-slate-700">
            <span className="font-semibold text-indigo-600">Salone Rent</span> is a modern online
            platform that connects renters and property owners across Sierra Leone. Our goal is to
            make finding or listing a house simple, transparent, and secure for everyone.
          </p>

          <div className="my-10 h-px w-full bg-gradient-to-r from-indigo-500/0 via-slate-200 to-indigo-500/0" />

          {/* Mission Section */}
          <Section
            title="Our Mission"
            content={
              <>
                <p>
                  To simplify the process of renting, buying, and managing properties in Sierra
                  Leone by providing a reliable digital space where landlords and tenants can
                  connect seamlessly.
                </p>
                <p className="mt-4">
                  We aim to eliminate the traditional challenges of property search — long delays,
                  misinformation, and lack of trust — by using technology to promote transparency
                  and efficiency.
                </p>
              </>
            }
          />

          {/* Vision Section */}
          <Section
            title="Our Vision"
            content={
              <>
                <p>
                  To become Sierra Leone’s most trusted property rental marketplace — where every
                  renter finds a home, and every landlord finds the right tenant with confidence.
                </p>
              </>
            }
          />

          {/* What We Offer */}
          <Section
            title="What We Offer"
            content={
              <>
                <ul className="list-disc list-inside space-y-2">
                  <li>Verified property listings across major cities and towns.</li>
                  <li>Easy communication between agents, landlords, and tenants.</li>
                  <li>Modern, mobile-friendly platform built for convenience.</li>
                  <li>Transparent and secure experience — no hidden fees.</li>
                </ul>
              </>
            }
          />

          {/* Our Team */}
          <Section
            title="Our Team"
            content={
              <>
                <p>
                  Salone Rent was founded by <strong>Kwilion LLC</strong>, a small team of passionate developers who believe in using technology to solve real-world problems. We continuously strive to improve the platform to better serve our users.
                </p>
              </>
            }
          />

          {/* Get in Touch */}
          <Section
            title="Get in Touch"
            content={
              <>
                <p>
                  We love hearing from our users! If you have feedback, partnership inquiries, or
                  support questions, please contact us at:{' '}
                  <a
                    href="mailto:info@salonerent.com"
                    className="text-indigo-600 hover:text-indigo-500 hover:underline"
                  >
                     info@kwilion.com
                  </a>
                  .
                </p>
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
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
      <div className="mt-4 text-lg leading-relaxed text-slate-700">{content}</div>
    </section>
  );
}
