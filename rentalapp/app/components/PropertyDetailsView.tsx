'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Bed,
  Bath,
  Home,
  Building,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import FavButton from './FavButton';
import ReadHere from './ReadHere';

export default function PropertyDetailsView({
  property,
  initialFav,
}: {
  property: any;
  initialFav: boolean;
}) {
  /* ---------------- image slider helpers ---------------- */
  const images = (property.images as { url: string }[]) || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSlide = () =>
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextSlide = () =>
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  /* ---------------- checkout helpers ---------------- */
  const [checkingOut, setCheckingOut] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const startCheckout = async () => {
    if (!agreedToTerms) return;          // extra safety
    setCheckingOut(true);
    const payload = {
      name: property.title,
      orderId: property.id,
      lineItems: [
        {
          type: 'custom',
          name: property.title,
          price: { currency: 'SLE', value: 2 * 100 }, // 2.00 SLE
          quantity: 1,
        },
      ],
      metadata: { cartId: 'cart_123' },
      callbackState: 'state_cart_123',
    };

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const { redirectUrl } = await res.json();
      if (redirectUrl) window.location.href = redirectUrl;
    } catch (err) {
      console.error(err);
      alert('Checkout failed');
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
                className="object-cover transition-all duration-500"
                priority
              />
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-5 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
              >
                <ChevronLeft size={30} />
              </button>
              <button
                onClick={nextSlide}
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
              src="https://placehold.co/800x600/E0E7FF/4F46E5?text=PropPulse "
              alt="Placeholder"
              fill
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
          {property.city}
        </p>
        {/* NEW electricity badge */}
        {property.electricity && (
          <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            <Zap size={16} />
            Electricity Available
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-bold text-blue-600 sm:mt-0">
        Nle{Number(property.price).toLocaleString()}
        <span className="text-base font-normal text-gray-500">/Yr</span>
      </p>
    </div>

    <div className="mt-8 border-t pt-8">
      <h2 className="text-xl font-semibold text-gray-800">About this property</h2>
      <p className="mt-4 leading-relaxed text-gray-600">{property.description || 'No description provided.'}</p>
    </div>

    {/* NEW virtual tours */}
    {property.virtualTours?.length > 0 && (
      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-800">Virtual Tours</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {property.virtualTours.map((t, idx) => (
            <div key={idx} className="rounded-lg border bg-white p-2">
              {t.type === 'video' ? (
                <video src={t.url} controls className="h-48 w-full rounded object-cover" />
              ) : (
                <iframe src={t.url} allowFullScreen className="h-48 w-full rounded" />
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="mt-8 border-t pt-8">
      <h2 className="text-xl font-semibold text-gray-800">Amenities</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 text-gray-700 sm:grid-cols-3">
        <div className="flex items-center gap-2"><Bed size={20} className="text-blue-500" /><span>{property.bedrooms} Bedrooms</span></div>
        <div className="flex items-center gap-2"><Bath size={20} className="text-blue-500" /><span>{property.bathrooms} Bathrooms</span></div>
        <div className="flex items-center gap-2"><Home size={20} className="text-blue-500" /><span>{property.landSize} sqft</span></div>
        <div className="flex items-center gap-2"><Building size={20} className="text-blue-500" /><span>Type: {property.propertyType}</span></div>
      </div>

      {/* NEW full amenity list */}
      {property.amenities?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {property.amenities.map((a) => (
            <span key={a.name} className="rounded bg-blue-50 px-3 py-1 text-sm text-blue-700">{a.name}</span>
          ))}
        </div>
      )}
    </div>

    {/* (keep your existing terms checkbox & button here) */}
    <div className="mt-8 border-t pt-8">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
        />
        I agree to the terms and conditions
      </label>
      {agreedToTerms && (
        <p className="mt-2 text-sm text-green-600">You have agreed to the terms and conditions.</p>
      )}
    </div>

    <div className="mt-6">
      {property.isAvailable ? (
        <button
          onClick={startCheckout}
          disabled={checkingOut || !agreedToTerms}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checkingOut ? 'Processing…' : 'Reserve this property'}
        </button>
      ) : (
        <p className="w-full rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
          This property has been reserved. The agent will re-activate it soon.
        </p>
      )}
    </div>
  </div>

  {/* Right: sticky card (keep your existing ReadHere here) */}
  <div className="lg:col-span-1">
    <div className="sticky top-28 rounded-xl border bg-gray-50 p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <ReadHere />
      </div>
    </div>
  </div>
</div>

      </div>
    </main>
  );
}