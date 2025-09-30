import Header from "../components/header";
import { fetchProperties } from "../action/fetchProperties";
import PropertyList from "../components/PropertyList";

type Props = {
  searchParams?: {
    city?: string;
    type?: string;
    price?: string;
    bedrooms?: string;
    electricity?: string;
    amenities?: string;
    page?: string;
  };
};

export default async function PropertiesPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  // always load page 1 – further pages loaded client-side
  const { properties } = await fetchProperties({ ...params, page: 1 });

  const hasSearchParams =
    params.city || params.type || params.price || params.bedrooms || params.electricity || params.amenities;

  return (
    <>
      <Header />
      <main className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {hasSearchParams ? "Search Results" : "All Properties"}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
              {hasSearchParams
                ? `Showing properties that match your criteria.`
                : "Browse our latest rental listings across Sierra Leone."}
            </p>
          </div>

          {properties.length > 0 ? (
            <PropertyList initialProperties={properties} searchParams={params} />
          ) : (
            <div className="mt-12 text-center">
              <p className="text-xl font-semibold text-gray-800">No Properties Found</p>
              <p className="mt-2 text-gray-500">
                We couldn&apos;t find any properties matching your search.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}