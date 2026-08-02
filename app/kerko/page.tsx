import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { getPublishedProperties } from '@/lib/properties';
import { Search, SlidersHorizontal } from 'lucide-react';

export const revalidate = 0;

type SearchParams = {
  purpose?: string;
  city?: string;
  type?: string;
  maxPrice?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  let properties = await getPublishedProperties(true);

  if (params.purpose === 'shitje' || params.purpose === 'qira') {
    properties = properties.filter(
      (property) => property.purpose === params.purpose
    );
  }

  if (params.city) {
    properties = properties.filter(
      (property) =>
        property.city.toLowerCase() === params.city?.toLowerCase()
    );
  }

  if (params.type) {
    properties = properties.filter(
      (property) =>
        property.type.toLowerCase() === params.type?.toLowerCase()
    );
  }

  const maxPrice = Number(params.maxPrice);

  if (params.maxPrice && Number.isFinite(maxPrice)) {
    properties = properties.filter(
      (property) => Number(property.price) <= maxPrice
    );
  }

  return (
    <>
      <Header />

      <main className="pageTop container">
        <p className="eyebrow">Prona në Kosovë</p>
        <h1>Gjej pronën tënde</h1>

        <form className="filterBar" action="/kerko" method="get">
          <select
            name="purpose"
            defaultValue={params.purpose || ''}
            aria-label="Qëllimi"
          >
            <option value="">Shitje dhe Me Qira</option>
            <option value="shitje">Shitje</option>
            <option value="qira">Me Qira</option>
          </select>

          <select
            name="city"
            defaultValue={params.city || ''}
            aria-label="Qyteti"
          >
            <option value="">Të gjitha qytetet</option>
            <option value="Prizren">Prizren</option>
            <option value="Prishtinë">Prishtinë</option>
            <option value="Ferizaj">Ferizaj</option>
            <option value="Pejë">Pejë</option>
            <option value="Gjakovë">Gjakovë</option>
            <option value="Gjilan">Gjilan</option>
            <option value="Mitrovicë">Mitrovicë</option>
          </select>

          <select
            name="type"
            defaultValue={params.type || ''}
            aria-label="Lloji i pronës"
          >
            <option value="">Të gjitha llojet</option>
            <option value="Apartament">Apartament</option>
            <option value="Shtëpi">Shtëpi</option>
            <option value="Vilë">Vilë</option>
            <option value="Lokal">Lokal</option>
            <option value="Truall">Truall</option>
          </select>

          <select
            name="maxPrice"
            defaultValue={params.maxPrice || ''}
            aria-label="Çmimi maksimal"
          >
            <option value="">Pa kufi çmimi</option>
            <option value="300">€300</option>
            <option value="500">€500</option>
            <option value="750">€750</option>
            <option value="1000">€1,000</option>
            <option value="50000">€50,000</option>
            <option value="100000">€100,000</option>
            <option value="150000">€150,000</option>
            <option value="250000">€250,000</option>
            <option value="500000">€500,000</option>
          </select>

          <button type="submit">
            <Search size={18} />
            Kërko
          </button>
        </form>

        <div className="resultsHead">
          <div>
            <h2>
              {properties.length}{' '}
              {properties.length === 1 ? 'pronë' : 'prona'}
            </h2>

            <p className="sectionLead">
              Rezultatet sipas filtrave të zgjedhur.
            </p>
          </div>

          <span className="resultsFilterLabel">
            <SlidersHorizontal size={18} />
            Filtra aktivë
          </span>
        </div>

        {properties.length > 0 ? (
          <div className="propertyGrid">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        ) : (
          <div className="emptySearchState">
            <Search size={34} />

            <h2>Nuk u gjet asnjë pronë</h2>

            <p>
              Provo të ndryshosh qytetin, llojin ose kufirin e
              çmimit.
            </p>
          </div>
        )}
      </main>
    </>
  );
}