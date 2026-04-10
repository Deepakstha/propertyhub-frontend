import Link from 'next/link';
import { graphqlFetch } from '@/lib/graphql-client';
import { LISTING_DETAIL_QUERY } from '@/lib/queries';
import { Property, PropertyType } from '@/lib/types';
import type { Metadata } from 'next';
import { getBadgeClass, getTypeIcon } from '@/utils/property.utils';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(price);
}



function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}



type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await graphqlFetch<{ listing: Property | null }>(LISTING_DETAIL_QUERY, { id });
    if (data.listing) {
      return {
        title: `${data.listing.title} — PropSearch`,
        description: data.listing.description.slice(0, 160),
      };
    }
  } catch {
    // fallback
  }
  return { title: 'Property Details — PropSearch' };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;

  let property: Property | null = null;
  let fetchError = false;

  try {
    const data = await graphqlFetch<{ listing: Property | null }>(LISTING_DETAIL_QUERY, { id });
    property = data.listing;
  } catch {
    fetchError = true;
  }

  if (fetchError) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/listings" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900" id="back-to-listings">
          ← Back to Listings
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <div className="mb-3 text-4xl">⚠️</div>
          <h3 className="mb-2 text-xl font-semibold text-red-700">Something went wrong</h3>
          <p className="text-sm text-red-600">Unable to load property details. Please make sure the backend is running and try again.</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/listings" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900" id="back-to-listings">
          ← Back to Listings
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <div className="mb-3 text-4xl">🔍</div>
          <h3 className="mb-2 text-xl font-semibold text-slate-700">Property not found</h3>
          <p className="text-sm text-slate-500">This property may have been removed or the link is invalid.</p>
        </div>
      </div>
    );
  }

  const listedDate = new Date(property.createdAt).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/listings" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900" id="back-to-listings">
        ← Back to Listings
      </Link>

      {/* Hero Image Placeholder */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-slate-900">
        <div className="relative h-64 md:h-96">
          <img src={getTypeIcon(property.propertyType)} alt={property.propertyType} className="h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
        </div>
        <span className={`absolute left-6 top-6 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ring-1 ${getBadgeClass(property.propertyType)}`}>
          {property.propertyType}
        </span>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl" id="property-title">{property.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 md:text-base">
          <span>📍</span> {property.suburb}
          <span className="text-slate-400">•</span>
          Listed {listedDate}
        </div>
      </div>

      <div className="mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-4xl font-bold text-transparent">
        {formatPrice(property.price)}
      </div>

      <div className="mb-10 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4 text-center">
          <div className="mb-1 text-2xl">🛏️</div>
          <div className="text-xl font-bold text-slate-900">{property.beds}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">Bedrooms</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 text-center">
          <div className="mb-1 text-2xl">🚿</div>
          <div className="text-xl font-bold text-slate-900">{property.baths}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">Bathrooms</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 text-center">
          <div className="mb-1 text-2xl">🏷️</div>
          <div className="text-xl font-bold text-slate-900">{property.propertyType.charAt(0) + property.propertyType.slice(1).toLowerCase()}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">Type</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 text-center">
          <div className="mb-1 text-2xl">📍</div>
          <div className="text-xl font-bold text-slate-900">{property.suburb}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">Suburb</div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="mb-3 text-xl font-semibold text-slate-900">About this property</h2>
        <p className="leading-8 text-slate-600">{property.description}</p>
      </div>

      {property.internalNotes && (
        <div className="mb-10">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-700">🔒 Internal Notes (Admin Only)</div>
            <div className="text-sm text-amber-900">{property.internalNotes}</div>
          </div>
        </div>
      )}

      {property.agent && (
        <div className="mb-10">
          <h2 className="mb-3 text-xl font-semibold text-slate-900">Listed by</h2>
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-lg font-bold text-white shadow">{getInitials(property.agent.name)}</div>
              <div>
                <h3 className="font-semibold text-slate-900">{property.agent.name}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  <a href={`mailto:${property.agent.email}`} className="transition hover:text-blue-600">
                  📧 {property.agent.email}
                </a>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                <a href={`tel:${property.agent.phone}`} className="transition hover:text-blue-600">
                  📞 {property.agent.phone}
                </a>
              </p>
            </div>
            </div>
            <div>
              <a href={`mailto:${property.agent.email}?subject=Enquiry: ${encodeURIComponent(property.title)}`}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                id="contact-agent-btn"
              >
                Contact Agent
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Property meta footer */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
        <span>🆔 ID: {property.id}</span>
        <span>📅 Created: {listedDate}</span>
      </div>
    </div>
  );
}
