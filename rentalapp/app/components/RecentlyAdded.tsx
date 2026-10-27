import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '../lib/prisma';
import PropertyCard from './PropertyCard';
import { publicListingWhere } from '../lib/listings';

async function getRecentProperties() {
  return prisma.property.findMany({
    where: publicListingWhere(),
    orderBy: { postedAt: 'desc' },
    take: 6,
    include: { amenities: { select: { name: true } }, agent: { select: { isVerified: true } } },
  });
}

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
            className="btn btn-primary btn-lg"
          >
            View All Properties
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
