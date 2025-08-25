import Link from 'next/link';
import Header from '../components/header'; // Use a standard path alias
import { fetchProperties } from '../action/fetchProperties'; // Use a standard path alias
import PropertyList from '../components/PropertyList'; // Use a standard path alias

// --- Main Page Component (Server Component) ---
export default async function PropertiesPage({
  searchParams,
}: {
  searchParams?: Promise<{ city?: string; type?: string; price?: string }>; // <- searchParams is a Promise
}) {
  // Fetch the initial 6 properties on the server
  const initialProperties = await fetchProperties({ page: 1, ...searchParams });

  const hasSearchParams = (await searchParams)?.city || (await searchParams)?.type || (await searchParams)?.price;

  return (
    <>
      <Header />
      <main className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {hasSearchParams ? 'Search Results' : 'All Properties'}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
              {hasSearchParams
                ? `Showing properties that match your criteria.`
                : 'Browse our latest rental listings across Sierra Leone.'}
            </p>
          </div>

          {/* Render the client component with the initial data.
            The PropertyList component will handle all subsequent "load more" actions.
          */}
          {initialProperties.length > 0 ? (
            <PropertyList initialProperties={initialProperties} searchParams={searchParams} />
          ) : (
            <div className="mt-12 text-center">
              <p className="text-xl font-semibold text-gray-800">No Properties Found</p>
              <p className="mt-2 text-gray-500">
                We couldn't find any properties matching your search.
              </p>
              <Link href="/properties" className="mt-6 inline-block rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                View All Properties
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
