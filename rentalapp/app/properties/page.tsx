import { PrismaClient } from '../generated/prisma'; // Adjust path if needed
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, Home } from 'lucide-react';
import Header from '../components/header'; // Using path alias for robustness

// --- Data Fetching (Server-Side) ---
const prisma = new PrismaClient();

// This function now accepts all three search parameters
async function getProperties({ city, type, price }: { city?: string; type?: string; price?: string }) {
  const whereClause: any = {};

  if (city) {
    whereClause.city = {
      equals: city,
      mode: 'insensitive',
    };
  }

  if (type) {
    whereClause.propertyType = {
      equals: type,
      mode: 'insensitive',
    };
  }

  // Add the price filter
  if (price && !isNaN(Number(price))) {
    whereClause.price = {
      lte: Number(price), // 'lte' means "less than or equal to"
    };
  }

  return await prisma.property.findMany({
    where: whereClause,
    orderBy: {
      postedAt: 'desc', // Order by the creation date, newest first
    },
  });
}

// --- Reusable Property Card Component ---
const PropertyCard = ({ property }) => (
  <div className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg">
    <Link href={`/properties/${property.id}`}>
      <div className="relative h-56 w-full">
        <Image
          src={property.imageUrl || 'https://placehold.co/600x400/E0E7FF/4F46E5?text=PropPulse'}
          alt={`Image of ${property.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          For Rent
        </div>
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
          <div className="flex items-center gap-1.5">
            <Home size={16} />
            <span>{property.landSize} sqft</span>
          </div>
        </div>
      </div>
    </Link>
  </div>
);

// --- Main Page Component (Server Component) ---
export default async function PropertiesPage({
  searchParams,
}: {
  // The page now accepts 'price' in the search parameters
  searchParams?: {
    city?: string;
    type?: string;
    price?: string;
  };
}) {
  // Pass the entire searchParams object to the data fetching function
  const properties = await getProperties(searchParams);

  const hasSearchParams = searchParams?.city || searchParams?.type || searchParams?.price;

  return (
    <>
      <Header />
      <main className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {hasSearchParams ? 'Search Results' : 'All Properties'}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
              {hasSearchParams
                ? `Showing properties that match your criteria.`
                : 'Browse our latest rental listings across Sierra Leone.'}
            </p>
          </div>

          {/* Property Grid */}
          {properties.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            // Message for when no properties are found
            <div className="mt-12 text-center">
              <p className="text-xl font-semibold text-gray-800">No Properties Found</p>
              <p className="mt-2 text-gray-500">
                We couldn't find any properties matching your search. Try adjusting your filters.
              </p>
              <Link href="/properties" className="mt-6 inline-block rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                View All Properties
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
