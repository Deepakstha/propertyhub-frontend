'use client';

import { PropertyType, ListingFilters } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

interface SearchFiltersProps {
  onSearch: (filters: ListingFilters) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const SUBURBS = [
    'Kathmandu',
    'Lalitpur',
    'Bhaktapur',
    'Thamel',
    'Kamalpokhari',
    'Budhanilkantha',
    'Kirtipur',
    'Makwanpur',
    'Dhulikhel',
    'Baglung',
  ];

  const [filters, setFilters] = useState<ListingFilters>({});

  useEffect(() => {
    const params: ListingFilters = {};
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const beds = searchParams.get('beds');
    const baths = searchParams.get('baths');
    const propertyType = searchParams.get('propertyType');
    const suburb = searchParams.get('suburb');
    const keyword = searchParams.get('keyword');

    if (priceMin) params.priceMin = Number(priceMin);
    if (priceMax) params.priceMax = Number(priceMax);
    if (beds) params.beds = Number(beds);
    if (baths) params.baths = Number(baths);
    if (propertyType && Object.values(PropertyType).includes(propertyType as PropertyType)) {
      params.propertyType = propertyType as PropertyType;
    }
    if (suburb) params.suburb = suburb;
    if (keyword) params.keyword = keyword;

    setFilters(params);
    if (Object.keys(params).length > 0) {
      onSearch(params);
    }
  }, []);

  const updateURL = useCallback(
    (newFilters: ListingFilters) => {
      const params = new URLSearchParams();
      if (newFilters.priceMin) params.set('priceMin', String(newFilters.priceMin));
      if (newFilters.priceMax) params.set('priceMax', String(newFilters.priceMax));
      if (newFilters.beds) params.set('beds', String(newFilters.beds));
      if (newFilters.baths) params.set('baths', String(newFilters.baths));
      if (newFilters.propertyType) params.set('propertyType', newFilters.propertyType);
      if (newFilters.suburb) params.set('suburb', newFilters.suburb);
      if (newFilters.keyword) params.set('keyword', newFilters.keyword);

      const qs = params.toString();
      router.push(qs ? `/listings?${qs}` : '/listings', { scroll: false });
    },
    [router],
  );

  const handleChange = (key: keyof ListingFilters, value: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === '') {
        delete next[key];
      } else if (['priceMin', 'priceMax', 'beds', 'baths'].includes(key)) {
        const num = Number(value);
        if (!isNaN(num) && num >= 0) {
          (next as Record<string, unknown>)[key] = num;
        }
      } else {
        (next as Record<string, unknown>)[key] = value;
      }
      return next;
    });
  };

  const handleSearch = () => {
    updateURL(filters);
    onSearch(filters);
  };

  const handleClear = () => {
    const empty: ListingFilters = {};
    setFilters(empty);
    updateURL(empty);
    onSearch(empty);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="mb-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8" onKeyDown={handleKeyDown}>
          <div className="xl:col-span-2">
            <label htmlFor="filter-keyword" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Keyword</label>
            <input
              id="filter-keyword"
              type="text"
              placeholder="Search properties..."
              value={filters.keyword || ''}
              onChange={(e) => handleChange('keyword', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="filter-suburb" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Suburb</label>
            <select
              id="filter-suburb"
              value={filters.suburb ?? ''}
              onChange={(e) => handleChange('suburb', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="">All Suburbs</option>
              {SUBURBS.map((suburb) => (
                <option key={suburb} value={suburb}>
                  {suburb}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter-priceMin" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Min Price</label>
            <input
              id="filter-priceMin"
              type="number"
              placeholder="e.g. 500000"
              value={filters.priceMin ?? ''}
              onChange={(e) => handleChange('priceMin', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="filter-priceMax" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Max Price</label>
            <input
              id="filter-priceMax"
              type="number"
              placeholder="e.g. 2000000"
              value={filters.priceMax ?? ''}
              onChange={(e) => handleChange('priceMax', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="filter-beds" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Beds</label>
            <select
              id="filter-beds"
              value={filters.beds ?? ''}
              onChange={(e) => handleChange('beds', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <div>
            <label htmlFor="filter-baths" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Baths</label>
            <select
              id="filter-baths"
              value={filters.baths ?? ''}
              onChange={(e) => handleChange('baths', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </div>
          <div>
            <label htmlFor="filter-propertyType" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Type</label>
            <select
              id="filter-propertyType"
              value={filters.propertyType ?? ''}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="">All Types</option>
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="TOWNHOUSE">Townhouse</option>
              <option value="LAND">Land</option>
            </select>
          </div>
          <div className="flex items-end gap-2 xl:col-span-1">
            <button className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700" onClick={handleSearch} id="search-btn">
              Search
            </button>
            <button className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" onClick={handleClear} id="clear-btn">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
