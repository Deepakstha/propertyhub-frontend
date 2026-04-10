import Link from 'next/link';
import { Property } from '@/lib/types';
import { getBadgeClass, getTypeIcon } from '@/utils/property.utils';

function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    return `$${(price / 1_000_000).toFixed(1)}M`;
  }
  return `$${(price / 1_000).toFixed(0)}K`;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/listings/${property.id}`} id={`property-${property.id}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900">
          <div className="absolute inset-0 bg-black/20" />
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ring-1 ${getBadgeClass(property.propertyType)}`}
          >
            {property.propertyType}
          </span>
          <img
            src={getTypeIcon(property.propertyType)}
            alt={property.propertyType}
            className="relative h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="space-y-4 p-5">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-3xl font-bold text-transparent">
            {formatPrice(property.price)}
          </div>
          <div className="line-clamp-2 min-h-12 text-base font-medium text-slate-700">
            {property.title}
          </div>
          <div className="flex gap-5 border-y border-slate-200 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>🛏️</span>
              <span className="font-semibold text-slate-900">{property.beds}</span> Beds
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>🚿</span>
              <span className="font-semibold text-slate-900">{property.baths}</span> Baths
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>📍</span> {property.suburb}
            </div>
            {property.agent && (
              <div className="text-xs font-medium text-slate-500">
                {property.agent.name}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
