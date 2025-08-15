import { PrismaClient } from '../generated/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, ArrowRight } from 'lucide-react';


// --- Data Fetching (Server-Side) ---
const prisma = new PrismaClient();

// This function fetches the 3 most recently created properties
async function getRecentProperties() {
  return await prisma.property.findMany({
    orderBy: {
      postedAt: 'desc', // Order by newest first
    },
    take: 4, // Limit the result to 4 properties
  });
}

// --- Reusable Property Card Component ---
const PropertyCard = ({ property }) => (
  <div className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <Link href={`/properties/${property.id}`}>
      <div className="relative h-56 w-full">
        <Image
          src={property.imageUrl || 'https://placehold.co/600x400/E0E7FF/4F46E5?text=PropPulse'}
          alt={`Image of ${property.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className="text-lg font-bold text-gray-900">Nle{Number(property.price).toLocaleString()}<span className="text-sm font-normal text-gray-500">/Yr</span></p>
        <h3 className="mt-1 truncate text-xl font-semibold text-gray-800 group-hover:text-blue-600">{property.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={14} />
           {property.city}
        </p>
        <div className="mt-4 flex items-center space-x-4 border-t pt-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Bed size={16} />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={16} />
            <span>{property.bathrooms} Baths</span>
          </div>
        </div>
      </div>
    </Link>
  </div>
);

// --- Main Component (Server Component) ---
export default async function RecentlyAdded() {
  const recentProperties = await getRecentProperties();

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Recently Added Properties
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
            Check out the latest rental properties available in Sierra Leone.
          </p>
        </div>

        {/* Property Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recentProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link href="/properties" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
            View All Properties
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
