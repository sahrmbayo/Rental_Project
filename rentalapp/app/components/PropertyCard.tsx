import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, Home, ShieldCheck } from 'lucide-react';
import WhatsAppShareButton from './WhatsAppShareButton';
import type { Property } from '../generated/prisma';
import type { ImageAsset } from '../lib/propertySchema';
import { PLACEHOLDER_IMAGE } from '../lib/constants';

export type PropertyCardData = Omit<Property, 'address' | 'latitude' | 'longitude'> & {
  amenities?: { name: string }[];
  agent?: { isVerified: boolean };
};

export default function PropertyCard({ property }: { property: PropertyCardData }) {
  const cover = (property.images as ImageAsset[] | null)?.[0]?.url || PLACEHOLDER_IMAGE;
  const amenities = property.amenities ?? [];

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/10">
      <Link href={`/properties/${property.id}`}>
        <div className="relative h-56 w-full">
          <Image
            src={cover}
            alt={`Image of ${property.title}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {property.electricity && (
              <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand-700 shadow-sm">⚡ Electricity</span>
            )}
            {!property.isAvailable && (
              <span className="rounded-full bg-accent-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">Reserved</span>
            )}
          </div>
        </div>

        <div className="p-4">
          <p className="text-lg font-extrabold text-brand-700">
            Nle{Number(property.price).toLocaleString()}
            <span className="text-sm font-normal text-gray-500">/Yr</span>
          </p>
          <h3 className="mt-1 truncate text-xl font-semibold text-gray-800 group-hover:text-brand-600">
            {property.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={14} />
            {property.area ? `${property.area}, ` : ''}{property.city}
            {property.agent?.isVerified && (
              <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                <ShieldCheck size={14} /> Verified agent
              </span>
            )}
          </p>

          {amenities.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {amenities.slice(0, 3).map((a) => (
                <span key={a.name} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                  {a.name}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="text-xs text-gray-500">+{amenities.length - 3} more</span>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-sm text-gray-800">
            <div className="flex items-center space-x-4">
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
            <WhatsAppShareButton property={{ id: property.id, title: property.title, price: property.price }} />
          </div>
        </div>
      </Link>
    </div>
  );
}
