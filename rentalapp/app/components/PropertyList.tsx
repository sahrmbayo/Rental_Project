'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchProperties } from '../action/fetchProperties'; // Use a standard path alias
import Spinner from './Spinner';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, Home } from 'lucide-react';

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
      </div>
      <div className="p-4">
        <p className="text-lg font-bold text-gray-900">${Number(property.price).toLocaleString()}<span className="text-sm font-normal text-gray-500">/mo</span></p>
        <h3 className="mt-1 truncate text-xl font-semibold text-gray-800 group-hover:text-blue-600">{property.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={14} />
          {property.address}, {property.city}
        </p>
        <div className="mt-4 flex items-center space-x-4 border-t pt-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5"><Bed size={16} /><span>{property.bedrooms} Beds</span></div>
          <div className="flex items-center gap-1.5"><Bath size={16} /><span>{property.bathrooms} Baths</span></div>
          <div className="flex items-center gap-1.5"><Home size={16} /><span>{property.landSize} sqft</span></div>
        </div>
      </div>
    </Link>
  </div>
);

export default function PropertyList({ initialProperties, searchParams }) {
  const [properties, setProperties] = useState(initialProperties);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialProperties.length > 0);
  const [isLoading, setIsLoading] = useState(false); // 1. Add loading state
  const { ref, inView } = useInView();

  const loadMoreProperties = async () => {
    setIsLoading(true); // 2. Set loading to true before fetching
    const newProperties = await fetchProperties({ page, ...searchParams });

    if (newProperties.length > 0) {
      setProperties((prev) => [...prev, ...newProperties]);
      setPage((prev) => prev + 1);
    } else {
      setHasMore(false);
    }
    setIsLoading(false); // 3. Set loading to false after fetching
  };

  useEffect(() => {
    // 4. Add a check for isLoading to prevent fetching on initial render
    if (inView && hasMore && !isLoading) {
      loadMoreProperties();
    }
  }, [inView, hasMore, isLoading]); // Add isLoading to dependency array

  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {hasMore && (
        <div ref={ref} className="mt-12 flex justify-center">
          <Spinner size="h-8 w-8 text-blue-600" />
        </div>
      )}
    </>
  );
}
