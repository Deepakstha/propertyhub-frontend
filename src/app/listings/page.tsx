'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import SearchFilters from '@/components/SearchFilters';
import PropertyCard from '@/components/PropertyCard';
import Pagination from '@/components/Pagination';
import { graphqlFetch } from '@/lib/graphql-client';
import { LISTINGS_QUERY } from '@/lib/queries';
import type { ListingConnection, ListingFilters, Property } from '@/lib/types';

const PAGE_SIZE = 12;

function ListingsPageContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const filtersRef = useRef<ListingFilters>({});

  const buildVariables = (filters: ListingFilters, cursor?: string | null) => {
    const cleanFilters: Record<string, unknown> = {};
    if (filters.priceMin !== undefined) cleanFilters.priceMin = filters.priceMin;
    if (filters.priceMax !== undefined) cleanFilters.priceMax = filters.priceMax;
    if (filters.beds !== undefined) cleanFilters.beds = filters.beds;
    if (filters.baths !== undefined) cleanFilters.baths = filters.baths;
    if (filters.propertyType) cleanFilters.propertyType = filters.propertyType;
    if (filters.suburb) cleanFilters.suburb = filters.suburb;
    if (filters.keyword) cleanFilters.keyword = filters.keyword;

    const variables: Record<string, unknown> = {
      pagination: { limit: PAGE_SIZE, ...(cursor ? { cursor } : {}) },
    };
    if (Object.keys(cleanFilters).length > 0) variables.filters = cleanFilters;
    return variables;
  };

  const fetchListings = useCallback(
    async (filters: ListingFilters, cursor?: string | null): Promise<ListingConnection> => {
      const variables = buildVariables(filters, cursor);
      const data = await graphqlFetch<{ listings: ListingConnection }>(LISTINGS_QUERY, variables);
      return data.listings;
    },
    [],
  );

  // Initial load
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchListings({})
      .then((result) => {
        if (cancelled) return;
        setProperties(result.edges.map((e) => e.node));
        setHasNextPage(result.pageInfo.hasNextPage);
        setEndCursor(result.pageInfo.endCursor);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [fetchListings]);

  const handleSearch = useCallback(
    async (filters: ListingFilters) => {
      filtersRef.current = filters;
      setLoading(true);
      setError(false);
      try {
        const result = await fetchListings(filters);
        setProperties(result.edges.map((e) => e.node));
        setHasNextPage(result.pageInfo.hasNextPage);
        setEndCursor(result.pageInfo.endCursor);
      } catch {
        setError(true);
        setProperties([]);
        setHasNextPage(false);
      } finally {
        setLoading(false);
      }
    },
    [fetchListings],
  );

  const handleLoadMore = useCallback(async () => {
    if (!endCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await fetchListings(filtersRef.current, endCursor);
      setProperties((prev) => [...prev, ...result.edges.map((e) => e.node)]);
      setHasNextPage(result.pageInfo.hasNextPage);
      setEndCursor(result.pageInfo.endCursor);
    } catch {
    } finally {
      setLoadingMore(false);
    }
  }, [endCursor, fetchListings, loadingMore]);

  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-52 animate-pulse bg-slate-200" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-4 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SearchFilters onSearch={handleSearch} />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <div className="mb-3 text-4xl">⚠️</div>
          <h3 className="mb-2 text-xl font-semibold text-red-700">Failed to load listings</h3>
          <p className="text-sm text-red-600">Unable to connect to the server. Please make sure the backend is running and try again.</p>
        </div>
      ) : loading ? (
        <SkeletonGrid />
      ) : properties.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <div className="mb-3 text-4xl">🏚️</div>
          <h3 className="mb-2 text-xl font-semibold text-slate-700">No properties found</h3>
          <p className="text-sm text-slate-500">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing <strong className="text-slate-900">{properties.length}</strong>{hasNextPage ? '+' : ''} properties
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <Pagination
            hasNextPage={hasNextPage}
            loading={loadingMore}
            onLoadMore={handleLoadMore}
          />
        </>
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-52 animate-pulse bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <ListingsPageContent />
    </Suspense>
  );
}
