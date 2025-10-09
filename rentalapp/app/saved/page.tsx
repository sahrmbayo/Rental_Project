// app/saved/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, ArrowLeft, Bed, Bath, Square } from 'lucide-react';
import { getSavedProperties } from '../action/favourite';
import RemoveButton from '../components/RemoveButton';
import { Metadata } from 'next';
import BackToHomeButton from '../components/BackToHomeButton';

export const metadata: Metadata = {
  title: 'Saved Properties | Salone Rent',
  description: 'View your saved properties and manage your favorites.',
};

export default async function SavedPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const favorites = await getSavedProperties();

  return (
    <main className="bg-neutral-50 text-neutral-800">
      {/* ---- top bar ---- */}
      <header className="sticky top-0 z-20 border-b border-neutral-200/70 bg-white/80 backdrop-blur-lg">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: back button */}
      <div>
      <BackToHomeButton variant="properties" />
      </div>

      {/* Center: page title (always visible) */}
      <h1 className="order-first sm:order-none text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
        Saved properties
      </h1>

      {/* Right: counter OR mobile-only empty CTA */}
      <p className="text-sm text-neutral-600 sm:hidden text-center">
        {favorites.length === 0
          ? "Start heart-ing places you love"
          : `${favorites.length} propert${favorites.length === 1 ? "y" : "ies"}`}
      </p>

      {/* Desktop-only counter (never shows “start heart-ing”) */}
      <p className="hidden text-sm text-neutral-600 sm:block">
        {favorites.length} propert{favorites.length === 1 ? "y" : "ies"}
      </p>
    </div>
  </div>
</header>


      {/* ---- content ---- */}
      <section className="mx-auto max-w-6xl px-6 py-10 min-h-screen">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white py-24">
            <Heart size={40} className="text-neutral-300" />
            <p className="mt-3 text-sm text-neutral-600">No favourites yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map(({ property }) => (
              <article
                key={property.id}
                className="group rounded-2xl bg-white p-1.5 shadow-sm transition hover:shadow-md"
              >
                {/* image - clickable */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Link
                    href={`/properties/${property.id}`}
                    aria-label={`View ${property.title}`}
                    className="absolute inset-0 z-10"
                  />
                  <Image
                    src={property.images?.[0]?.url || 'https://placehold.co/800x600'}
                    alt={property.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* body */}
                <div className="mt-4 space-y-3 px-1 pb-2">
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900">{property.title}</h3>
                    <p className="flex items-center gap-1 text-sm text-neutral-500">
                      <MapPin size={12} />
                      {property.city}
                    </p>
                  </div>

                  <p className="text-sm text-neutral-600">{property.description?.slice(0, 80)}…</p>

                  {/* icons */}
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1"><Bed size={12} />{property.bedrooms}</span>
                    <span className="flex items-center gap-1"><Bath size={12} />{property.bathrooms}</span>
                    <span className="flex items-center gap-1"><Square size={12} />{property.landSize} sqft</span>
                  </div>

                  {/* price + actions */}
                  <div className="flex items-end justify-between pt-2">
                    <div>
                      <span className="text-xl font-semibold text-neutral-900">
                        Nle{Number(property.price).toLocaleString()}
                      </span>
                      <span className="ml-1 text-xs text-neutral-400">/ yr</span>
                    </div>
                    <RemoveButton propertyId={property.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}