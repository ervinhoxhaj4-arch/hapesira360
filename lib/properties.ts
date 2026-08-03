import { supabase } from './supabase';
import { properties as demoProperties } from './demo-data';
import type { DbProperty, UiProperty } from './types';

const fallbackImage =
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=85';

export function mapDbProperty(
  property: DbProperty
): UiProperty {
  const sortedImages = [
    ...(property.property_images || []),
  ].sort(
    (a, b) =>
      Number(b.cover) - Number(a.cover)
  );

  const images = sortedImages.map(
    (image) => image.image_url
  );

  return {
    id: property.id,
    title: property.title,

    purpose:
      property.status === 'rent'
        ? 'qira'
        : 'shitje',

    type: property.property_type,

    city: property.city,
    neighborhood: property.address || '',

    whatsapp: property.whatsapp || null,

    price: Number(property.price),
    area: property.area || 0,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,

    floor:
      property.floor === null
        ? undefined
        : property.floor,

    description: property.description || '',

    latitude: property.latitude || 0,
    longitude: property.longitude || 0,

    googleMapsUrl:
      property.google_maps_url || undefined,

    tour360Url:
      property.tour360_url || undefined,

    coverImage:
      images[0] || fallbackImage,

    images:
      images.length > 0
        ? images
        : [fallbackImage],

    featured: property.featured,
    published: property.published,
  };
}

export async function getPublishedProperties(
  useFallback = true
): Promise<UiProperty[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_images(*)')
    .eq('published', true)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error(
      'Supabase properties error:',
      error.message
    );

    return useFallback
      ? demoProperties
      : [];
  }

  if (!data?.length) {
    return useFallback
      ? demoProperties
      : [];
  }

  return (data as DbProperty[]).map(
    mapDbProperty
  );
}

export async function getPublishedProperty(
  id: string
): Promise<UiProperty | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_images(*)')
    .eq('id', id)
    .eq('published', true)
    .maybeSingle();

  if (!error && data) {
    return mapDbProperty(
      data as DbProperty
    );
  }

  return (
    demoProperties.find(
      (item) => item.id === id
    ) || null
  );
}

export async function getAdminProperties(): Promise<
  DbProperty[]
> {
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_images(*)')
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data || []) as DbProperty[];
}