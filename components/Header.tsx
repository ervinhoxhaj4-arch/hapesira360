import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" className="brand" aria-label="Hapësira360 Ballina">
          <Image src="/logo-icon.png" alt="" width={44} height={44} className="brandLogo" priority />
          <span className="brandText">Hapësira<span>360</span></span>
        </Link>
        <nav className="desktopNav" aria-label="Navigimi kryesor">
          <Link href="/te-preferuarat">Të preferuarat</Link>
          <Link href="/">Ballina</Link>
          <Link href="/kerko?purpose=shitje">Shitje</Link>
          <Link href="/kerko?purpose=qira">Me Qira</Link>
          <Link href="#kontakt">Kontakti</Link>
        </nav>
        <button className="menuButton" aria-label="Hap menynë"><Menu size={22} /></button>
      </div>
    </header>
  );
}
