import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/h360-admin',
        '/shto-prone',
        '/api/',
      ],
    },
    sitemap: 'https://hapesira360.com/sitemap.xml',
  };
}