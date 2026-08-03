'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function HtmlLanguage() {
  const pathname = usePathname();

  useEffect(() => {
    const isEnglish =
      pathname === '/en' ||
      pathname.startsWith('/en/');

    document.documentElement.lang = isEnglish
      ? 'en'
      : 'sq';
  }, [pathname]);

  return null;
}