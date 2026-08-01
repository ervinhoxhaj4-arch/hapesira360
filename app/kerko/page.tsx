import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/lib/demo-data';
import { SlidersHorizontal } from 'lucide-react';

export default function SearchPage() {
  return <><Header/><main className="pageTop container"><p className="eyebrow">Prona në Kosovë</p><h1>Gjej pronën tënde</h1><div className="filterBar"><select><option>Shitje dhe Me Qira</option><option>Shitje</option><option>Me Qira</option></select><select><option>Të gjitha qytetet</option><option>Prizren</option><option>Prishtinë</option><option>Ferizaj</option></select><select><option>Të gjitha llojet</option><option>Apartament</option><option>Shtëpi</option></select><button><SlidersHorizontal size={18}/> Më shumë filtra</button></div><div className="resultsHead"><h2>{properties.length} prona</h2><select><option>Më të rejat</option><option>Çmimi: ulët-lart</option><option>Çmimi: lart-ulët</option></select></div><div className="propertyGrid">{properties.map((property)=><PropertyCard key={property.id} property={property}/>)}</div></main></>;
}
