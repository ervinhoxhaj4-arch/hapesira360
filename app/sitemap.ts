import { MetadataRoute } from 'next';
import { getPublishedProperties } from '@/lib/properties';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getPublishedProperties(true);

  const propertyPages = properties.map((property) => ({
    url: `https://hapesira360.com/prona/${property.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [
    {
      url: 'https://hapesira360.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://hapesira360.com/kerko',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...propertyPages,
  ];
}