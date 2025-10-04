import { prisma } from '../lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, ArrowRight } from 'lucide-react';
import WhatsAppShareButton from '../components/WhatsAppShareButton'; 



async function getRecentProperties() {
  return await prisma.property.findMany({
    orderBy: { postedAt: 'desc' },
    take: 6,
    include: { amenities: true }, 
  });
}

/* ---------- Re-usable Card ---------- */
const PropertyCard = ({ property }) => (
  <div className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <Link href={`/properties/${property.id}`}>
      <div className="relative h-56 w-full">
        <Image
          src={property.images?.[0]?.url || 'https://placehold.co/600x400/E0E7FF/4F46E5?text=PropPulse'}
          alt={`Image of ${property.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* 2️⃣ Electricity badge */}
        {property.electricity && (
          <span className="absolute top-2 left-2 rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
            Electricity
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-lg font-bold text-gray-900">
          Nle{Number(property.price).toLocaleString()}
          <span className="text-sm font-normal text-gray-500">/Yr</span>
        </p>
        <h3 className="mt-1 truncate text-xl font-semibold text-gray-800 group-hover:text-blue-600">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={14} />
          {property.city}
        </p>

        {/* 3️ Amenities list (max 3 + “+n more”) */}
        {property.amenities?.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {property.amenities.slice(0, 3).map((a) => (
              <span
                key={a.name}
                className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
              >
                {a.name}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-xs text-gray-500">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-1.5">
              <Bed size={16} />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath size={16} />
              <span>{property.bathrooms} Baths</span>
            </div>
          </div>

          {/* 1️⃣ WhatsApp share button */}
          <WhatsAppShareButton property={property} />
        </div>
      </div>
    </Link>
  </div>
);

/* ---------- Main Server Component ---------- */
export default async function RecentlyAdded() {
  const recentProperties = await getRecentProperties();

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Recently Added Properties
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
            Check out the latest rental properties available in Sierra Leone.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recentProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            View All Properties
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}