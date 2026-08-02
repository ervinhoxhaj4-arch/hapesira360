import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" className="brand" aria-label="Hapësira360 Ballina">
          <Image
  src="/logo.png"
  alt="Hapësira360"
  width={220}
  height={60}
  priority
/>
        </Link>
        <nav className="desktopNav" aria-label="Navigimi kryesor">
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
