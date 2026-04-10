export enum PropertyType {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  TOWNHOUSE = 'TOWNHOUSE',
  LAND = 'LAND',
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  beds: number;
  baths: number;
  propertyType: PropertyType;
  suburb: string;
  agentId: string;
  createdAt: string;
  agent: Agent;
  internalNotes?: string | null;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface ListingEdge {
  cursor: string;
  node: Property;
}

export interface ListingConnection {
  edges: ListingEdge[];
  pageInfo: PageInfo;
}

export interface ListingFilters {
  priceMin?: number;
  priceMax?: number;
  beds?: number;
  baths?: number;
  propertyType?: PropertyType;
  suburb?: string;
  keyword?: string;
}
