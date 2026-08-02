export type PropertyImage = {
  id: string;
  property_id: string;
  image_url: string;
  cover: boolean;
};

export type DbProperty = {
  id: string;
  title: string;
  status: 'sale' | 'rent';
  property_type: string;
  city: string;
  address: string | null;
  price: number;
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: number | null;
  parking: boolean;
  furnished: boolean;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  tour360_url: string | null;
  published: boolean;
  created_at: string;
  property_images?: PropertyImage[];
};

export type UiProperty = {
  id: string;
  title: string;
  purpose: 'shitje' | 'qira';
  type: string;
  city: string;
  neighborhood: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  description: string;
  latitude: number;
  longitude: number;
  googleMapsUrl?: string;
  tour360Url?: string;
  coverImage: string;
  images: string[];
  featured: boolean;
  published: boolean;
};
