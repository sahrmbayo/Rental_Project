'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  MapPin,
  Bed,
  Bath,
  Home,
  Building,
  ChevronLeft,
  ChevronRight,
  Zap,
  ShieldCheck,
  Star,
} from 'lucide-react';
import FavButton from './FavButton';
import ReadHere from './ReadHere';
import ReportListingButton from './ReportListingButton';
import { AreaMap } from './map';
import type { Property } from '../generated/prisma';
import { PLACEHOLDER_IMAGE } from '../lib/constants';
import { PROPERTY_TYPES, type ImageAsset, type VirtualTour } from '../lib/propertySchema';

export type ListingStatus = 'available' | 'reserved' | 'rented' | 'expired';

type PropertyDetails = Omit<Property, 'address' | 'latitude' | 'longitude'> & { amenities: { name: string }[] };

const STATUS_MESSAGE: Record<Exclude<ListingStatus, 'available'>, string> = {
  reserved: 'This property has been reserved. It will be re-listed if no agreement is reached.',
  rented: 'This property has been rented out.',
  expired: 'This listing is no longer active.',
};

export default function PropertyDetailsView({
  property,
  initialFav,
  reservationFee,
  status,
  approxLocation,
  agent,
}: {
  property: PropertyDetails;
  initialFav: boolean;
  reservationFee: number;
  status: ListingStatus;
  approxLocation: { lat: number; lng: number } | null;
  agent: { isVerified: boolean; rating: number | null; reviewCount: number };
}) {
  /* ---------------- image slider helpers ---------------- */
  const images = (property.images as ImageAsset[] | null) ?? [];
  const tours = (property.virtualTours as VirtualTour[] | null) ?? [];
  const typeLabel = PROPERTY_TYPES.find((t) => t.value === property.propertyType)?.label ?? property.propertyType;
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSlide = () =>
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextSlide = () =>
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  /* ---------------- checkout helpers ---------------- */
  const [checkingOut, setCheckingOut] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const startCheckout = async () => {
    if (!agreedToTerms) return;
    setCheckingOut(true);

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id }),
      });
      if (res.status === 401) {
        toast.error('Please sign in to reserve this property');
        window.location.href = `/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Checkout failed');
      if (data.redirectUrl) window.location.href = data.redirectUrl;
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  /* ---------------- render ---------------- */
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Image slider */}
        <div className="relative h-80 w-full overflow-hidden rounded-xl md:h-[500px]">
          {images.length ? (
            <>
              <Image
                src={images[currentIndex]?.url}
                alt={`Image ${currentIndex + 1} of ${property.title}`}
                fill
                sizes="(min-width: 1280px) 1216px, 100vw"
                className="object-cover transition-all duration-500"
                priority
              />
              <button
                onClick={prevSlide}
                aria-label="Previous image"
                className="absolute top-1/2 left-5 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
              >
                <ChevronLeft size={30} />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next image"
                className="absolute top-1/2 right-5 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
              >
                <ChevronRight size={30} />
              </button>
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-2">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 w-2 cursor-pointer rounded-full transition-all ${
                      idx === currentIndex
                        ? 'bg-white scale-125'
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <Image
              src={PLACEHOLDER_IMAGE}
              alt="No image available"
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>

<div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
  {/* Left: details */}
  <div className="lg:col-span-2">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center justify-between gap-4 md:gap-30">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{property.title}</h1>
          <FavButton propertyId={property.id} initial={initialFav} />
        </div>
        <p className="mt-2 flex items-center gap-2 text-lg text-gray-500">
          <MapPin size={20} />
          {property.area ? `${property.area}, ` : ''}{property.city}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {property.electricity && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-800">
              <Zap size={14} />
              Electricity
            </span>
          )}
          {agent.isVerified && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-sm font-medium text-white">
              <ShieldCheck size={14} />
              Verified agent
            </span>
          )}
          {agent.reviewCount > 0 && agent.rating != null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-sm font-medium text-accent-800">
              <Star size={14} className="fill-accent-400 text-accent-400" />
              {agent.rating.toFixed(1)} agent rating ({agent.reviewCount})
            </span>
          )}
        </div>
      </div>
      <p className="mt-4 text-3xl font-extrabold text-brand-700 sm:mt-0">
        Nle{Number(property.price).toLocaleString()}
        <span className="text-base font-normal text-gray-500">/Yr</span>
      </p>
    </div>

    <div className="mt-8 border-t pt-8">
      <h2 className="text-xl font-semibold text-gray-800">About this property</h2>
      <p className="mt-4 leading-relaxed text-gray-600">{property.description || 'No description provided.'}</p>
    </div>

    {/* NEW virtual tours */}
    {tours.length > 0 && (
      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-800">Virtual Tours</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {tours.map((t, idx) => (
            <div key={idx} className="rounded-lg border bg-white p-2">
              <TourPreview tour={t} />
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="mt-8 border-t pt-8">
      <h2 className="text-xl font-semibold text-gray-800">Amenities</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 text-gray-700 sm:grid-cols-3">
        <div className="flex items-center gap-2"><Bed size={20} className="text-brand-500" /><span>{property.bedrooms} Bedrooms</span></div>
        <div className="flex items-center gap-2"><Bath size={20} className="text-brand-500" /><span>{property.bathrooms} Bathrooms</span></div>
        <div className="flex items-center gap-2"><Home size={20} className="text-brand-500" /><span>{property.landSize} sqft</span></div>
        <div className="flex items-center gap-2"><Building size={20} className="text-brand-500" /><span>Type: {typeLabel}</span></div>
      </div>

      {property.amenities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {property.amenities.map((a) => (
            <span key={a.name} className="rounded bg-brand-50 px-3 py-1 text-sm text-brand-700">{a.name}</span>
          ))}
        </div>
      )}
    </div>

    {approxLocation && (
      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-800">Location</h2>
        <p className="mt-1 text-sm text-gray-500">Approximate area. The exact address is shared after you reserve.</p>
        <div className="mt-4 h-72 overflow-hidden rounded-2xl border border-gray-200">
          <AreaMap lat={approxLocation.lat} lng={approxLocation.lng} />
        </div>
      </div>
    )}

    <div className="mt-8 border-t pt-8">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
        />
        <span>
          I agree to the{' '}
          <Link href="/terms-of-service" target="_blank" className="text-brand-600 underline">
            terms and conditions
          </Link>
        </span>
      </label>
      {agreedToTerms && (
        <p className="mt-2 text-sm text-green-600">You have agreed to the terms and conditions.</p>
      )}
    </div>

    <div className="mt-6">
      {status === 'available' ? (
        <button
          onClick={startCheckout}
          disabled={checkingOut || !agreedToTerms}
          className="btn btn-accent btn-lg w-full"
        >
          {checkingOut ? 'Processing…' : `Reserve this property (NLe ${reservationFee.toLocaleString()})`}
        </button>
      ) : (
        <p className="w-full rounded-2xl border border-accent-200 bg-accent-50 px-4 py-3 text-center text-sm text-accent-800">
          {STATUS_MESSAGE[status]}
        </p>
      )}
    </div>

    <div className="mt-4 flex justify-end">
      <ReportListingButton propertyId={property.id} />
    </div>
  </div>

  <div className="lg:col-span-1">
    <div className="sticky top-28 rounded-xl border bg-gray-50 p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <ReadHere fee={reservationFee} />
      </div>
    </div>
  </div>
</div>

      </div>
    </main>
  );
}

function TourPreview({ tour }: { tour: VirtualTour }) {
  if (tour.type === 'video') {
    return <video src={tour.url} controls className="h-48 w-full rounded object-cover" />;
  }
  if (tour.type === '2D') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={tour.url} alt={tour.caption || 'Virtual tour'} className="h-48 w-full rounded object-cover" />
    );
  }
  return (
    <a
      href={tour.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-48 w-full items-center justify-center rounded bg-gray-100 text-sm font-medium text-brand-600 hover:underline"
    >
      Open 3D tour
    </a>
  );
}