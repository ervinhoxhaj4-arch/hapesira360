import Link from 'next/link';
import { Search } from 'lucide-react';

export default function SearchBox() {
  return (
    <div className="searchBox">
      <div className="toggle">
        <button className="active">Shitje</button>
        <button>Me Qira</button>
      </div>
      <div className="searchFields">
        <label><span>Qyteti</span><select defaultValue="Prizren"><option>Prizren</option><option>Prishtinë</option><option>Ferizaj</option><option>Pejë</option></select></label>
        <label><span>Lloji</span><select defaultValue="Të gjitha"><option>Të gjitha</option><option>Apartament</option><option>Shtëpi</option><option>Vilë</option></select></label>
        <label><span>Çmimi maksimal</span><select defaultValue="Pa kufi"><option>Pa kufi</option><option>€100,000</option><option>€150,000</option><option>€250,000</option></select></label>
        <Link href="/kerko" className="searchButton"><Search size={19}/> Kërko</Link>
      </div>
    </div>
  );
}
