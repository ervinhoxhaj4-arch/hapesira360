import type { MetadataRoute } from 'next';
import { getPublishedProperties } from '@/lib/properties';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const properties=await getPublishedProperties(false); return [{url:'https://hapesira360.com',lastModified:new Date()},{url:'https://hapesira360.com/kerko',lastModified:new Date()},...properties.map(p=>({url:`https://hapesira360.com/prona/${p.id}`,lastModified:new Date()}))]; }
