import type { Metadata } from "next";
import Link from "next/link";
import { List, Map as MapIcon } from "lucide-react";
import Header from "../components/header";
import { fetchMapPins, fetchProperties } from "../action/fetchProperties";
import PropertyList from "../components/PropertyList";
import SearchFilters from "../components/SearchFilters";
import SaveSearchButton from "../components/SaveSearchButton";
import { ResultsMap } from "../components/map";
import { SITE_NAME } from "../lib/config";
import { pickSearchParams } from "../lib/listings";

export const metadata: Metadata = {
  title: `Browse Properties | ${SITE_NAME}`,
  description: "Browse rental homes, apartments, offices and shops across Sierra Leone.",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function PropertiesPage({ searchParams }: Props) {
  const raw = await searchParams;
  const params = pickSearchParams(raw);
  const view = raw.view === "map" ? "map" : "list";

  const { sort: _sort, ...filters } = params;
  const hasFilters = Object.keys(filters).length > 0;

  const toggleHref = (v: "list" | "map") => {
    const qs = new URLSearchParams(params as Record<string, string>);
    if (v === "map") qs.set("view", "map");
    const s = qs.toString();
    return `/properties${s ? `?${s}` : ""}`;
  };

  const [{ properties, totalCount }, pins] = await Promise.all([
    fetchProperties({ ...params, page: 1 }),
    view === "map" ? fetchMapPins(params) : Promise.resolve([]),
  ]);

  return (
    <>
      <Header />
      <main className="bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {hasFilters ? "Search results" : "All properties"}
            </h1>
            <p className="mt-2 text-gray-500">Browse rental listings across Sierra Leone.</p>
          </div>

          <SearchFilters params={params} view={view} />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              <strong>{totalCount.toLocaleString()}</strong> propert{totalCount === 1 ? "y" : "ies"} found
            </p>
            <div className="flex items-center gap-2">
              {hasFilters && <SaveSearchButton params={params} />}
              <div className="flex rounded-full border border-gray-200 bg-white p-1">
                <Link
                  href={toggleHref("list")}
                  className={`btn btn-sm ${view === "list" ? "bg-brand-600 text-white" : "btn-ghost"}`}
                >
                  <List size={14} /> List
                </Link>
                <Link
                  href={toggleHref("map")}
                  className={`btn btn-sm ${view === "map" ? "bg-brand-600 text-white" : "btn-ghost"}`}
                >
                  <MapIcon size={14} /> Map
                </Link>
              </div>
            </div>
          </div>

          {view === "map" ? (
            <div className="mt-6">
              <div className="h-[560px] overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                <ResultsMap pins={pins} />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Pins show the approximate area. {pins.length < totalCount && `${totalCount - pins.length} listings have no location yet.`}
              </p>
            </div>
          ) : properties.length > 0 ? (
            <PropertyList initialProperties={properties} searchParams={params} />
          ) : (
            <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-xl font-semibold text-gray-800">No properties found</p>
              <p className="mt-2 text-gray-500">Try fewer filters, or save this search to hear about new listings.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
