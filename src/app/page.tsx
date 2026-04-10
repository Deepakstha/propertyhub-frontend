'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, Home, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);


  const nepaliLocations = [
    'Kathmandu',
    'Lalitpur',
    'Bhaktapur',
    'Thamel',
    'Kamalpokhari',
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div
          className={`space-y-4 transition-all duration-1000 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            Find Your Perfect{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
              Property in Nepal
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Discover hundreds of premium listings across Nepal's most sought-after neighborhoods. 
            Filter by price, property type, amenities, and more. From modern apartments to spacious family homes.
          </p>
        </div>

        <div
          className={`transition-all duration-1000 delay-100 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Featured Neighborhoods
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {nepaliLocations.map((location) => (
              <span
                key={location}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                {location}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center pt-8 transition-all duration-1000 delay-200 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/listings"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            id="explore-listings-btn"
          >
            Explore Listings
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}