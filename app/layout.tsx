import GoogleAnalytics from '@/components/GoogleAnalytics';
import HtmlLanguage from '@/components/HtmlLanguage';

import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://hapesira360.com'),

  title: {
    default: 'Hapësira360 — Prona në Kosovë',
    template: '%s | Hapësira360',
  },

  description:
    'Prona në shitje dhe me qira në Kosovë, me fotografi cilësore, lokacion dhe vizita virtuale 360°.',

  alternates: {
    canonical: '/',
    languages: {
      sq: '/',
      en: '/en',
    },
  },

  openGraph: {
    siteName: 'Hapësira360',
    type: 'website',
    locale: 'sq_AL',
    alternateLocale: ['en_US'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq">
      <body>
        <HtmlLanguage />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}