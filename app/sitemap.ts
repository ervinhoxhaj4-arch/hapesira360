import { MetadataRoute } from 'next';
import { getPublishedProperties } from '@/lib/properties';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getPublishedProperties(true);

  const propertyPages = properties.flatMap((property) => [
    {
      url: `https://hapesira360.com/prona/${property.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `https://hapesira360.com/en/prona/${property.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]);

  return [
    // Albanian
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
    {
      url: 'https://hapesira360.com/harta',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://hapesira360.com/te-preferuarat',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // English
    {
      url: 'https://hapesira360.com/en',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: 'https://hapesira360.com/en/kerko',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://hapesira360.com/en/harta',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://hapesira360.com/en/te-preferuarat',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // Properties in both languages
    ...propertyPages,
  ];
}