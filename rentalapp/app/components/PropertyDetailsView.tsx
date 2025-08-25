'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Bed, Bath, Home, Building, ChevronLeft, ChevronRight, User } from 'lucide-react';
import CheckoutButton from './CheckoutButton';


export default function PropertyDetailsView({ property }) {
  // Array of images for the slider, filtering out any that are missing
  const images = [
    property.imageUrl,
    property.imageUr2,
  ].filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* --- NEW Image Slider --- */}
        <div className="relative h-80 w-full overflow-hidden rounded-xl md:h-[500px]">
          {images.length > 0 ? (
            <>
              <Image
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1} of ${property.title}`}
                fill
                className="object-cover transition-all duration-500"
                priority
              />
              {/* Left Arrow */}
              <div className="absolute top-1/2 left-5 -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-2 text-white hover:bg-black/50">
                <ChevronLeft onClick={prevSlide} size={30} />
              </div>
              {/* Right Arrow */}
              <div className="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-2 text-white hover:bg-black/50">
                <ChevronRight onClick={nextSlide} size={30} />
              </div>
              {/* Dots */}
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-2">
                {images.map((_, slideIndex) => (
                  <div
                    key={slideIndex}
                    onClick={() => setCurrentIndex(slideIndex)}
                    className={`h-2 w-2 cursor-pointer rounded-full transition-all ${
                      currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                  ></div>
                ))}
              </div>
            </>
          ) : (
             <div className="relative h-full w-full">
                <Image src={'https://placehold.co/800x600/E0E7FF/4F46E5?text=PropPulse'} alt="Placeholder" fill className="object-cover" />
             </div>
          )}
        </div>

        {/* --- Main Content Layout --- */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left Column: Property Details */}
          <div className="lg:col-span-2">
            <div className="flex flex-row items-start justify-between sm:flex-row">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{property.title}</h1>
                <p className="mt-2 flex items-center gap-2 text-lg text-gray-500">
                  <MapPin size={20} />
                  {property.city}
                </p>
              </div>
              <p className="mt-4 text-3xl font-bold text-blue-600 sm:mt-0">${Number(property.price).toLocaleString()}<span className="text-base font-normal text-gray-500">/Yr</span></p>
            </div>

            <div className="mt-8 border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-800">About this property</h2>
              <p className="mt-4 leading-relaxed text-gray-600">{property.description || 'No description provided.'}</p>
            </div>

            <div className="mt-8 border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-800">Amenities</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 text-gray-700 sm:grid-cols-3">
                <div className="flex items-center gap-2"><Bed size={20} className="text-blue-500" /><span>{property.bedrooms} Bedrooms</span></div>
                <div className="flex items-center gap-2"><Bath size={20} className="text-blue-500" /><span>{property.bathrooms} Bathrooms</span></div>
                <div className="flex items-center gap-2"><Home size={20} className="text-blue-500" /><span>{property.landSize} sqft</span></div>
                <div className="flex items-center gap-2"><Building size={20} className="text-blue-500" /><span>Type: {property.propertyType}</span></div>
              </div>
            </div>
          </div>

          {/* Right Column: Agent Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-xl border bg-gray-50 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                   <Image src={property.agent?.imageUrl || `https://i.pravatar.cc/150?u=${property.agentId}`} alt={`Photo of ${property.agent?.name}`} fill className="rounded-full object-cover" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{property.agent?.name || 'Agent Name'}</p>
                  <p className="text-sm text-gray-500">Listing Agent</p>
                </div>
              </div>
             <CheckoutButton />

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
