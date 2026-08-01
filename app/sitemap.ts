import type { MetadataRoute } from 'next';
import { properties } from '@/lib/demo-data';
export default function sitemap(): MetadataRoute.Sitemap { return [{url:'https://hapesira360.com',lastModified:new Date()},{url:'https://hapesira360.com/kerko',lastModified:new Date()},...properties.map(p=>({url:`https://hapesira360.com/prona/${p.id}`,lastModified:new Date()}))]; }
