'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

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

    const browserLanguage =
      navigator.language ||
      navigator.languages?.[0] ||
      '';

    const prefersEnglish =
      browserLanguage.toLowerCase().startsWith('en');

    if (prefersEnglish) {
      setVisible(true);
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
    <div className="languageSuggestion">
      <div className="languageSuggestionText">
        <span aria-hidden="true">🇬🇧</span>

        <div>
          <strong>
            It looks like you prefer English.
          </strong>

          <p>
            View Hapësira360 in English?
          </p>
        </div>
      </div>

      <div className="languageSuggestionActions">
        <Link
          href={englishPath}
          className="languageSuggestionButton"
        >
          View in English
        </Link>

        <button
          type="button"
          className="languageSuggestionClose"
          onClick={dismiss}
          aria-label="Dismiss language suggestion"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}