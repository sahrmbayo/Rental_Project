'use client';

import { MapPin, Home, DollarSign, Search } from 'lucide-react';

export default function Hero() {
    const sierraLeoneCities = [
    "Freetown", 
    "Bo", 
    "Kenema"
  ];

  const propertyTypes = [
    "House", 
    "Compound", 
    "Apartment", 
    "Room", 
    "Office Space", 
    "Shop"
  ];
  return (
    <section className="bg-gradient-to-b from-blue-500 to-white pt-16 pb-20 text-white text-center">
      {/* Heading */}
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Home In Sierra Leone</h1>
        <p className="text-base md:text-lg text-white/90">
          Browse thousands of rental properties across Sierra Leone.
          <br />
          From houses to compounds, find your perfect space with verified agents.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white mt-10 mx-4 md:mx-auto max-w-5xl p-4 md:p-6 rounded-2xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Select City */}
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <span>Select City</span>
          </div>

          {/* Property Type */}
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 text-gray-600">
            <Home className="w-4 h-4 mr-2 text-gray-500" />
            <span>Property Type</span>
          </div>

          {/* Price Range */}
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
            <span>Price Range (Le)</span>
          </div>

          {/* Search Button */}
          <button className="flex items-center justify-center gap-2 text-white text-sm md:text-base font-medium py-2 px-4 rounded-full bg-gradient-to-r from-blue-600 to-pink-500 hover:opacity-90 transition-all shadow-md">
            <Search className="w-4 h-4" />
            Search Properties
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto px-4 text-gray-800 text-center">
        <div>
          <h3 className="text-2xl font-bold">1,200+</h3>
          <p className="text-sm text-gray-600">Properties Listed</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">10</h3>
          <p className="text-sm text-gray-600">Cities Covered</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">500+</h3>
          <p className="text-sm text-gray-600">Verified Agents</p>
        </div>
      </div>
    </section>
  );
}
