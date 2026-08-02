import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots { return { rules: [{ userAgent: '*', allow: '/', disallow: ['/h360-admin','/dashboard','/shto-prone'] }], sitemap: 'https://hapesira360.com/sitemap.xml' }; }
