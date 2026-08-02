import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hapësira360 — Prona në Kosovë',
  description: 'Prona në shitje dhe me qira, me fotografi cilësore dhe vizita virtuale 360°.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sq"><body>{children}</body></html>;
}
