'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from './Spinner';
import { CITIES, PROPERTY_TYPES } from '../lib/propertySchema';

import {
  MapPin,
  Home,
  DollarSign,
  Search,
  Plus,
  Minus,
  SlidersHorizontal,
  Wifi,
  Car,
  Wind,
  Dog,
  Waves,
  Dumbbell,
  Shield,
  Droplets,
  Zap,
} from 'lucide-react';


// Helper for amenity icons
const amenityIcons: { [key: string]: React.ReactNode } = {
  WiFi: <Wifi className="h-4 w-4" />,
  Parking: <Car className="h-4 w-4" />,
  'Air-conditioning': <Wind className="h-4 w-4" />,
  'Pet-friendly': <Dog className="h-4 w-4" />,
  Pool: <Waves className="h-4 w-4" />,
  Gym: <Dumbbell className="h-4 w-4" />,
  Security: <Shield className="h-4 w-4" />,
  'Water-supply': <Droplets className="h-4 w-4" />,
  Electricity: <Zap className="h-4 w-4" />,
};

export default function Hero() {
  const [heroStats, setHeroStats] = useState<{ totalProperties: number; totalAgents: number } | null>(null);

  useEffect(() => {
    fetch('/api/total-props')
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(setHeroStats)
      .catch(console.error);
  }, []);

  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false); // State to toggle advanced filters

  /* ---------- Search Filters State ---------- */
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const amenityList = Object.keys(amenityIcons);

  const toggleAmenity = (name: string) =>
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );

  /* ---------- Search Handler ---------- */

 const handleSearch = () => {
  setIsSearching(true);
  const params = new URLSearchParams();

  if (selectedCity) params.set("city", selectedCity);
  if (selectedType) params.set("type", selectedType);
  if (maxPrice) params.set("price", maxPrice);

  if (bedrooms > 0) params.set("bedrooms", bedrooms.toString());

  if (selectedAmenities.length) {
    params.set("amenities", selectedAmenities.join(","));
  }

  // Always reset to first page when performing a new search
  params.set("page", "1");

  router.push(`/properties?${params.toString()}`);
};



  /* ---------- UI Data ---------- */
  const sierraLeoneCities = CITIES;
  const propertyTypes = PROPERTY_TYPES;
  const priceRanges = [
    { label: 'Up to NLe 5,000', value: '5000' },
    { label: 'Up to NLe 10,000', value: '10000' },
    { label: 'Up to NLe 25,000', value: '25000' },
    { label: 'Up to NLe 50,000', value: '50000' },
    { label: 'NLe 50,000+', value: '50000+' },
  ];

  return (
    // <section className="dark:bg-gray-900 bg-gradient-to-b from-brand-500 to-brand-50 pt-20 pb-20 text-center">

    <section
  className="relative pt-20 pb-20 text-center min-h-screen"
  
>
<div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/Hero.jpg')" }}
  />

  {/* Brand-tinted overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-brand-950/70 via-brand-900/40 to-brand-950/70 pointer-events-none"></div>

      <div className="relative z-10 container mx-auto max-w-4xl px-4">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white ring-1 ring-white/25 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-accent-400" />
          Verified agents across Sierra Leone
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl mb-4">
          Find your next home in <span className="text-accent-400">Salone</span>
        </h1>
        <p className="mx-auto max-w-2xl text-base text-white/90 md:text-lg">
          Browse rental properties across Sierra Leone and find your perfect space, securely connected with verified agents.
        </p>

      </div>

      <div className="relative z-10 container mx-auto mt-10 max-w-5xl px-4">
        {/* ----- Main Search Bar ----- */}
        <div className="grid grid-cols-1 items-center gap-2 rounded-2xl bg-white p-3 shadow-2xl shadow-brand-950/30 md:grid-cols-2 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-gray-200">
          {/* City */}
          <div className="relative col-span-1 lg:col-span-1">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full appearance-none rounded-md border-transparent bg-transparent py-3 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Cities</option>
              {sierraLeoneCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="relative col-span-1 lg:col-span-1">
            <Home className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none rounded-md border-transparent bg-transparent py-3 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Types</option>
              {propertyTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="relative col-span-1 lg:col-span-1">
            <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full appearance-none rounded-md border-transparent bg-transparent py-3 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Any Price</option>
              {priceRanges.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Advanced Filters Button */}
          <div className="col-span-1 lg:col-span-1">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`btn w-full py-3 ${showAdvanced ? 'bg-brand-50 text-brand-700' : 'btn-ghost'}`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
          
          {/* Search Button */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="btn btn-accent w-full py-3 lg:ml-2"
            >
              {isSearching ? (
                <><Spinner size="h-5 w-5 text-white" /><span>Searching...</span></>
              ) : (
                <><Search className="h-5 w-5" /><span>Search</span></>
              )}
            </button>
          </div>
        </div>

        {/* ----- Advanced Filters Panel (Conditional) ----- */}
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${showAdvanced ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
        >
          <div className="rounded-2xl bg-white p-6 shadow-lg text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bedrooms */}
              <div className="md:col-span-1">
                <p className="mb-2 text-sm font-medium text-gray-700">Bedrooms</p>
                <div className="inline-flex items-center gap-4 rounded-lg border border-gray-200 p-2">
                  <button
                    onClick={() => setBedrooms((b) => Math.max(0, b - 1))}
                    className="rounded-full p-1.5 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
                    disabled={bedrooms === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg text-gray-400">{bedrooms > 0 ? bedrooms : 'Any'}</span>
                  <button
                    onClick={() => setBedrooms((b) => b + 1)}
                    className="rounded-full p-1.5 text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Amenities */}
              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-medium text-gray-700">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {amenityList.map((a) => {
                    const active = selectedAmenities.includes(a);
                    return (
                      <button
                        key={a}
                        onClick={() => toggleAmenity(a)}
                        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border transition-colors ${
                          active
                            ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                            : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {amenityIcons[a]}
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 container mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-8 px-4 text-center text-gray-800 sm:grid-cols-3">
        <div className=' flex items-center justify-center flex-col'>
          <h3 className="text-white text-3xl font-bold">{heroStats?.totalProperties ?? <Spinner  />}<sup className='text-white'>+</sup></h3>
          <p className="text-sm text-white">Properties Listed</p>
        </div>
        <div>
          <h3 className="text-white text-3xl font-bold">{sierraLeoneCities.length}</h3>
          <p className="text-sm text-white">Cities Covered</p>
        </div>
        <div className="col-span-2 sm:col-span-1 flex items-center justify-center flex-col">
          <h3 className="text-white text-3xl font-bold">{heroStats?.totalAgents ?? <Spinner  />}</h3>
          <p className="text-sm text-white">Verified Agents</p>
        </div>
      </div>
    </section>
  );
}