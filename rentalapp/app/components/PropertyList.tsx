'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchProperties } from '../action/fetchProperties';
import Spinner from './Spinner';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, Home } from 'lucide-react';
import WhatsAppShareButton from './WhatsAppShareButton';

const PropertyCard = ({ property }) => (
  <div className=" group overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg">
    <Link href={`/properties/${property.id}`}>
      <div className="relative h-56 w-full">
        <Image
          src={property.imageUrl || 'https://placehold.co/600x400/E0E7FF/4F46E5?text=PropPulse'}
          alt={`Image of ${property.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
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

        {/* amenities */}
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

        <div className="mt-auto"></div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-sm text-gray-800 dark:border-gray-600 dark:text-gray-300">
          {/* Left side: Stats */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-1.5 text-gray-800">
              <Bed size={16} />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-800">
              <Bath size={16} />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-800">
              <Home size={16} />
              <span>{property.landSize} sqft</span>
            </div>
          </div>

          {/* Right side: WhatsApp */}
          <div>
            <WhatsAppShareButton property={property} />
          </div>
        </div>
      </div>
    </Link>
  </div>
);

export default function PropertyList({ initialProperties, searchParams }) {
  const [properties, setProperties] = useState(initialProperties);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialProperties.length > 0);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();

  const loadMoreProperties = async () => {
    setIsLoading(true);
    const { properties: newProperties } = await fetchProperties({
      page,
      ...searchParams,
    });

    if (newProperties.length > 0) {
      setProperties((prev) => [...prev, ...newProperties]);
      setPage((prev) => prev + 1);
    } else {
      setHasMore(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (inView && hasMore && !isLoading) loadMoreProperties();
  }, [inView, hasMore, isLoading]);

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
