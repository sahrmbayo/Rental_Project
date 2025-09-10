'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Home, DollarSign, Search } from 'lucide-react';
import Spinner from './Spinner';

export default function Hero() {
  const [heroStats, setHeroStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/total-props');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setHeroStats(data);
      } catch (error) {
        console.error('Error fetching hero stats:', error);
      }
    };

    fetchData();
  }, []);


  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  

  // State to hold the user's selections
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const sierraLeoneCities = [
    "Freetown",
    "Bo",
    "Kenema",
  ];

  const propertyTypes = [
    "House",
    "Compound",
    "Apartment",
    "Single Room",
    "Office Space",
    "Shop",
  ];

  // Function to handle the search button click
  const handleSearch = () => {
    setIsSearching(true);
    // Use URLSearchParams to easily build the query string
    const params = new URLSearchParams();

    if (selectedCity) {
      params.set('city', selectedCity);
    }
    if (selectedType) {
      params.set('type', selectedType);
    }
    if (priceRange) {
      params.set('price', priceRange);
    }

    // Navigate to the properties page with the search parameters
    // e.g., /properties?city=Freetown&type=House
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="bg-gradient-to-b from-blue-500 to-white pt-16 pb-20 text-center">
      {/* Heading */}
      <div className="mx-auto max-w-2xl px-4">
        <h1 className="text-4xl font-bold text-white md:text-5xl mb-4">Home In Sierra Leone</h1>
        <p className="text-base text-white/90 md:text-lg">
          Browse thousands of rental properties across Sierra Leone.
          <br />
          From houses to compounds, find your perfect space with verified agents.
        </p>
      </div>

      {/* Search Box */}
      <div className="mx-4 mt-10 max-w-5xl rounded-2xl bg-white p-4 shadow-lg md:mx-auto md:p-6">
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3 lg:grid-cols-4">
          {/* Select City */}
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-300 bg-transparent py-3 pl-11 pr-4 text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="" disabled>Select City</option>
              {sierraLeoneCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="relative">
            <Home className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-300 bg-transparent py-3 pl-11 pr-4 text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="" disabled>Property Type</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="relative">
             <DollarSign className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
             <input
                type="number"
                placeholder="Max Price (Le)"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-transparent py-3 pl-11 pr-4 text-gray-600 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
             />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 py-3 px-4 font-medium text-white shadow-md transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSearching ? (
              <>
                <Spinner />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span>Search Properties</span>
                
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 px-4 text-center text-gray-800 sm:grid-cols-3">
        <div>
          <h3 className="text-2xl font-bold">{heroStats?.totalProperties || 0}</h3>
          <p className="text-sm text-gray-600">Properties Listed</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">{`3`}</h3>
          <p className="text-sm text-gray-600">Cities Covered</p>
        </div>
        <div className='hidden sm:block'>
          <h3 className="text-2xl font-bold">{heroStats?.totalAgents || 0}</h3>
          <p className="text-sm text-gray-600">Verified Agents</p>
        </div>
      </div>
    </section>
  );
}
