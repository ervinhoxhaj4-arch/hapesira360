'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Globe2, X } from 'lucide-react';

const STORAGE_KEY = 'h360-language-suggestion-dismissed';

export default function LanguageSuggestion() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isEnglishPage =
      pathname === '/en' ||
      pathname.startsWith('/en/');

    if (isEnglishPage) {
      setVisible(false);
      return;
    }

    const dismissed =
      localStorage.getItem(STORAGE_KEY) === 'true';

    if (dismissed) {
      return;
    }

    const browserLanguages =
      navigator.languages?.length
        ? navigator.languages
        : [navigator.language];

    const prefersEnglish = browserLanguages.some(
      (language) =>
        language.toLowerCase().startsWith('en')
    );

    if (prefersEnglish) {
      const timer = window.setTimeout(() => {
        setVisible(true);
      }, 700);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [pathname]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  const englishPath =
    pathname === '/'
      ? '/en'
      : `/en${pathname}`;

  return (
    <div
      className="languageModalBackdrop"
      role="presentation"
    >
      <section
        className="languageModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-modal-title"
      >
        <button
          type="button"
          className="languageModalClose"
          onClick={dismiss}
          aria-label="Close language suggestion"
        >
          <X size={20} />
        </button>

        <div className="languageModalIcon">
          <Globe2 size={30} />
        </div>

        <p className="languageModalEyebrow">
          English version available
        </p>

        <h2 id="language-modal-title">
          Would you prefer to continue in English?
        </h2>

        <p className="languageModalText">
          Browse properties, search filters and property
          details in English.
        </p>

        <div className="languageModalActions">
          <Link
            href={englishPath}
            className="languageModalPrimary"
          >
            Continue in English
          </Link>

          <button
            type="button"
            className="languageModalSecondary"
            onClick={dismiss}
          >
            Continue in Albanian
          </button>
        </div>

        <small className="languageModalNote">
          You can change the language at any time from the
          header.
        </small>
      </section>
    </div>
  );
}