import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { getPublishedProperties } from '@/lib/properties';
import { SlidersHorizontal } from 'lucide-react';

export const revalidate = 0;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ purpose?: string; city?: string }> }) {
  const params = await searchParams;
  let properties = await getPublishedProperties(true);
  if (params.purpose === 'shitje' || params.purpose === 'qira') properties = properties.filter((p)=>p.purpose===params.purpose);
  if (params.city) properties = properties.filter((p)=>p.city.toLowerCase()===params.city?.toLowerCase());
  return <><Header/><main className="pageTop container"><p className="eyebrow">Prona në Kosovë</p><h1>Gjej pronën tënde</h1><div className="filterBar"><select defaultValue={params.purpose || ''}><option value="">Shitje dhe Me Qira</option><option value="shitje">Shitje</option><option value="qira">Me Qira</option></select><select defaultValue={params.city || ''}><option value="">Të gjitha qytetet</option><option>Prizren</option><option>Prishtinë</option><option>Ferizaj</option></select><select><option>Të gjitha llojet</option><option>Apartament</option><option>Shtëpi</option></select><button><SlidersHorizontal size={18}/> Më shumë filtra</button></div><div className="resultsHead"><h2>{properties.length} prona</h2></div><div className="propertyGrid">{properties.map(p=><PropertyCard key={p.id} property={p}/>)}</div></main></>;
}
