import Link from "next/link";
import Header from "../components/header";
import { fetchProperties } from "../action/fetchProperties";
import PropertyList from "../components/PropertyList";

type Props = {
  searchParams?: {
    city?: string;
    type?: string;        // matches propertyType
    price?: string;
    bedrooms?: string;
    electricity?: string; // new
    amenities?: string;
    page?: string;
  };
};

export default async function PropertiesPage({ searchParams }: Props) {
  const params = searchParams ?? {};
  const currentPage = params.page ? Number(params.page) : 1;

  const { properties, totalCount } = await fetchProperties({ ...params, page: currentPage });

  const totalPages = Math.ceil(totalCount / 6); // 6 = PAGE_SIZE
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
            <>
              <PropertyList initialProperties={properties} searchParams={params} />

              {/* Pagination */}
              <div className="mt-8 flex justify-center space-x-4">
                {currentPage > 1 && (
                  <Link
                    href={{ pathname: "/properties", query: { ...params, page: currentPage - 1 } }}
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Previous
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    href={{ pathname: "/properties", query: { ...params, page: currentPage + 1 } }}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Next
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="mt-12 text-center">
              <p className="text-xl font-semibold text-gray-800">No Properties Found</p>
              <p className="mt-2 text-gray-500">
                We couldn't find any properties matching your search.
              </p>
              <Link
                href="/properties"
                className="mt-6 inline-block rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                View All Properties
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
