'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isEnglish =
    pathname === '/en' || pathname.startsWith('/en/');

  const basePath = isEnglish ? '/en' : '';

  const labels = isEnglish
    ? {
        home: 'Home',
        sale: 'For Sale',
        rent: 'For Rent',
        map: 'Map',
        favorites: 'Favorites',
        contact: 'Contact',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        mainNavigation: 'Main navigation',
        mobileNavigation: 'Mobile navigation',
        homeAria: 'Hapësira360 Home',
      }
    : {
        home: 'Ballina',
        sale: 'Shitje',
        rent: 'Me Qira',
        map: 'Harta',
        favorites: 'Të preferuarat',
        contact: 'Kontakti',
        openMenu: 'Hap menynë',
        closeMenu: 'Mbyll menynë',
        mainNavigation: 'Navigimi kryesor',
        mobileNavigation: 'Navigimi mobil',
        homeAria: 'Hapësira360 Ballina',
      };

  const links = {
    home: basePath || '/',
    sale: `${basePath}/kerko?purpose=shitje`,
    rent: `${basePath}/kerko?purpose=qira`,
    map: `${basePath}/harta`,
    favorites: `${basePath}/te-preferuarat`,
    contact: `${basePath || '/'}#kontakt`,
  };

  const languageLink = isEnglish ? '/' : '/en';
  const languageLabel = isEnglish ? 'SQ' : 'EN';

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="header">
      <div className="container nav">
        <Link
          href={links.home}
          className="brand"
          aria-label={labels.homeAria}
          onClick={closeMenu}
        >
          <Image
            src="/logo-icon.png"
            alt=""
            width={44}
            height={44}
            className="brandLogo"
            priority
          />

          <span className="brandText">
            Hapësira<span>360</span>
          </span>
        </Link>

        <nav
          className="desktopNav"
          aria-label={labels.mainNavigation}
        >
          <Link href={links.home}>
            {labels.home}
          </Link>

          <Link href={links.sale}>
            {labels.sale}
          </Link>

          <Link href={links.rent}>
            {labels.rent}
          </Link>

          <Link href={links.map}>
            {labels.map}
          </Link>

          <Link href={links.favorites}>
            {labels.favorites}
          </Link>

          <Link href={links.contact}>
            {labels.contact}
          </Link>

          <Link
            href={languageLink}
            className="languageSwitch"
            aria-label={
              isEnglish
                ? 'Kalo në shqip'
                : 'Switch to English'
            }
          >
            {languageLabel}
          </Link>
        </nav>

        <div className="mobileHeaderActions">
          <Link
            href={languageLink}
            className="languageSwitch mobileLanguageSwitch"
            aria-label={
              isEnglish
                ? 'Kalo në shqip'
                : 'Switch to English'
            }
            onClick={closeMenu}
          >
            {languageLabel}
          </Link>

          <button
            type="button"
            className="menuButton"
            aria-label={
              menuOpen
                ? labels.closeMenu
                : labels.openMenu
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
          >
            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="mobileNav"
          aria-label={labels.mobileNavigation}
        >
          <Link
            href={links.home}
            onClick={closeMenu}
          >
            {labels.home}
          </Link>

          <Link
            href={links.sale}
            onClick={closeMenu}
          >
            {labels.sale}
          </Link>

          <Link
            href={links.rent}
            onClick={closeMenu}
          >
            {labels.rent}
          </Link>

          <Link
            href={links.map}
            onClick={closeMenu}
          >
            {labels.map}
          </Link>

          <Link
            href={links.favorites}
            onClick={closeMenu}
          >
            {labels.favorites}
          </Link>

          <Link
            href={links.contact}
            onClick={closeMenu}
          >
            {labels.contact}
          </Link>
        </nav>
      )}
    </header>
  );
}