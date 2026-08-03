'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="header">
      <div className="container nav">
        <Link
          href="/"
          className="brand"
          aria-label="Hapësira360 Ballina"
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
          aria-label="Navigimi kryesor"
        >
          <Link href="/">Ballina</Link>
          <Link href="/kerko?purpose=shitje">Shitje</Link>
          <Link href="/kerko?purpose=qira">Me Qira</Link>
          <Link href="/harta">Harta</Link>
          <Link href="/te-preferuarat">Të preferuarat</Link>
          <Link href="/#kontakt">Kontakti</Link>
        </nav>

        <button
          type="button"
          className="menuButton"
          aria-label={
            menuOpen ? 'Mbyll menynë' : 'Hap menynë'
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="mobileNav"
          aria-label="Navigimi mobil"
        >
          <Link href="/" onClick={closeMenu}>
            Ballina
          </Link>

          <Link
            href="/kerko?purpose=shitje"
            onClick={closeMenu}
          >
            Shitje
          </Link>

          <Link
            href="/kerko?purpose=qira"
            onClick={closeMenu}
          >
            Me Qira
          </Link>

          <Link href="/harta" onClick={closeMenu}>
            Harta
          </Link>

          <Link
            href="/te-preferuarat"
            onClick={closeMenu}
          >
            Të preferuarat
          </Link>

          <Link href="/#kontakt" onClick={closeMenu}>
            Kontakti
          </Link>
        </nav>
      )}
    </header>
  );
}