'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchProperties, type PropertySearchParams } from '../action/fetchProperties';
import Spinner from './Spinner';
import PropertyCard, { type PropertyCardData } from './PropertyCard';

const PAGE_SIZE = 6;

export default function PropertyList({
  initialProperties,
  searchParams,
}: {
  initialProperties: PropertyCardData[];
  searchParams: PropertySearchParams;
}) {
  const [properties, setProperties] = useState(initialProperties);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialProperties.length === PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();

  /* reset on filter change */
  useEffect(() => {
    setProperties(initialProperties);
    setPage(2);
    setHasMore(initialProperties.length === PAGE_SIZE);
  }, [searchParams, initialProperties]);

  /* load more + de-duplicate */
  const loadMoreProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const { properties: newProperties } = await fetchProperties({ ...searchParams, page });
      const existing = new Set(properties.map((p) => p.id));
      const fresh = newProperties.filter((p) => !existing.has(p.id));
      if (fresh.length) setProperties([...properties, ...fresh]);
      setHasMore(fresh.length === PAGE_SIZE);
      setPage((p) => p + 1);
    } catch (e) {
      console.error(e);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchParams, properties]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) loadMoreProperties();
  }, [inView, hasMore, isLoading, loadMoreProperties]);

  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      {hasMore && (
        <div ref={ref} className="mt-12 flex justify-center">
          <Spinner size="h-8 w-8 text-brand-600" />
        </div>
      )}
    </>
  );
}
