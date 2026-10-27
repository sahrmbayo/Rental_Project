import Link from 'next/link';
import { Search } from 'lucide-react';
import { CITIES, PROPERTY_TYPES } from '../lib/propertySchema';
import type { PropertySearchParams } from '../lib/listings';

const PRICES = [
  { label: 'Any price', value: '' },
  { label: 'Up to NLe 5,000', value: '5000' },
  { label: 'Up to NLe 10,000', value: '10000' },
  { label: 'Up to NLe 25,000', value: '25000' },
  { label: 'Up to NLe 50,000', value: '50000' },
  { label: 'NLe 50,000+', value: '50000+' },
];

const SORTS = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Price: low to high', value: 'price_asc' },
  { label: 'Price: high to low', value: 'price_desc' },
];

const field =
  'w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30';

/** Plain GET form so filtering works even before JavaScript loads. */
export default function SearchFilters({ params, view }: { params: PropertySearchParams; view?: string }) {
  return (
    <form method="get" action="/properties" className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {view === 'map' && <input type="hidden" name="view" value="map" />}
      {params.amenities && <input type="hidden" name="amenities" value={params.amenities} />}
      {params.electricity && <input type="hidden" name="electricity" value={params.electricity} />}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input name="q" defaultValue={params.q} placeholder="Search title, area or description" className={`${field} pl-10`} />
        </div>
        <select name="city" defaultValue={params.city ?? ''} className={field}>
          <option value="">All cities</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input name="area" defaultValue={params.area} placeholder="Area, e.g. Lumley" className={field} />
        <select name="type" defaultValue={params.type ?? ''} className={field}>
          <option value="">All types</option>
          {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select name="price" defaultValue={params.price ?? ''} className={field}>
          {PRICES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <select name="bedrooms" defaultValue={params.bedrooms ?? ''} className={field}>
          <option value="">Any bedrooms</option>
          {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} bedroom{n > 1 ? 's' : ''}</option>)}
        </select>
        <select name="sort" defaultValue={params.sort ?? 'newest'} className={field}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <Link href={view === 'map' ? '/properties?view=map' : '/properties'} className="btn btn-ghost btn-sm">Clear</Link>
        <button type="submit" className="btn btn-primary">Apply filters</button>
      </div>
    </form>
  );
}
