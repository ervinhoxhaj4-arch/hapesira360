import Link from 'next/link';
import { Building2, MapPin, Search, WalletCards } from 'lucide-react';

export default function SearchBox() {
  return (
    <div className="searchBox">
      <div className="toggle" role="group" aria-label="Lloji i listimit">
        <button className="active">Shitje</button>
        <button>Me Qira</button>
      </div>
      <div className="searchFields">
        <label><span><MapPin size={14}/> Qyteti</span><select defaultValue="Prizren"><option>Prizren</option><option>Prishtinë</option><option>Ferizaj</option><option>Pejë</option></select></label>
        <label><span><Building2 size={14}/> Lloji</span><select defaultValue="Të gjitha"><option>Të gjitha</option><option>Apartament</option><option>Shtëpi</option><option>Vilë</option></select></label>
        <label><span><WalletCards size={14}/> Çmimi maksimal</span><select defaultValue="Pa kufi"><option>Pa kufi</option><option>€100,000</option><option>€150,000</option><option>€250,000</option></select></label>
        <Link href="/kerko" className="searchButton"><Search size={19}/> Kërko</Link>
      </div>
    </div>
  );
}
