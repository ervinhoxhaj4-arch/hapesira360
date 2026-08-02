import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { getPublishedProperties } from '@/lib/properties';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

type SearchParams = {
  purpose?: string;
  city?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  minArea?: string;
  tour360?: string;
  sort?: string;
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
  const selectedCity = params.city
    .trim()
    .toLocaleLowerCase('sq');

  properties = properties.filter((property) => {
    const propertyCity = property.city
      .trim()
      .toLocaleLowerCase('sq');

    return propertyCity === selectedCity;
  });
  }

  if (params.type) {
    properties = properties.filter(
      (property) =>
        property.type.toLowerCase() === params.type?.toLowerCase()
    );
  }

  const minPrice = Number(params.minPrice);

  if (params.minPrice && Number.isFinite(minPrice)) {
    properties = properties.filter(
      (property) => Number(property.price) >= minPrice
    );
  }

  const maxPrice = Number(params.maxPrice);

  if (params.maxPrice && Number.isFinite(maxPrice)) {
    properties = properties.filter(
      (property) => Number(property.price) <= maxPrice
    );
  }

  const bedrooms = Number(params.bedrooms);

  if (params.bedrooms && Number.isFinite(bedrooms)) {
    properties = properties.filter(
      (property) => Number(property.bedrooms || 0) >= bedrooms
    );
  }

  const bathrooms = Number(params.bathrooms);

  if (params.bathrooms && Number.isFinite(bathrooms)) {
    properties = properties.filter(
      (property) => Number(property.bathrooms || 0) >= bathrooms
    );
  }

  const minArea = Number(params.minArea);

  if (params.minArea && Number.isFinite(minArea)) {
    properties = properties.filter(
      (property) => Number(property.area || 0) >= minArea
    );
  }

  if (params.tour360 === 'yes') {
    properties = properties.filter(
      (property) => Boolean(property.tour360Url)
    );
  }

  if (params.sort === 'price-low') {
    properties.sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
  }

  if (params.sort === 'price-high') {
    properties.sort(
      (a, b) => Number(b.price) - Number(a.price)
    );
  }

  if (params.sort === 'area-high') {
    properties.sort(
      (a, b) => Number(b.area || 0) - Number(a.area || 0)
    );
  }

  const hasActiveFilters = Object.entries(params).some(
  ([key, value]) =>
    key !== 'sort' &&
    typeof value === 'string' &&
    value.length > 0
);

  return (
    <>
      <Header />

      <main className="pageTop container">
        <div className="advancedSearchHeading">
          <div>
            <p className="eyebrow">Prona në Kosovë</p>
            <h1>Gjej pronën tënde</h1>
            <p className="sectionLead">
              Filtro listimet sipas lokacionit, çmimit dhe
              karakteristikave.
            </p>
          </div>

          {hasActiveFilters && (
            <Link href="/kerko" className="clearFiltersButton">
              <X size={17} />
              Pastro filtrat
            </Link>
          )}
        </div>

        <form
          className="advancedFilterPanel"
          action="/kerko"
          method="get"
        >
          <div className="advancedFilterTop">
            <div>
              <SlidersHorizontal size={21} />
              <strong>Filtrat e kërkimit</strong>
            </div>

            <button type="submit">
              <Search size={18} />
              Kërko prona
            </button>
          </div>

          <div className="advancedFilterGrid">
            <label>
              Qëllimi
              <select
                name="purpose"
                defaultValue={params.purpose || ''}
              >
                <option value="">Shitje dhe Me Qira</option>
                <option value="shitje">Shitje</option>
                <option value="qira">Me Qira</option>
              </select>
            </label>

            <label>
              Qyteti
              <select
                name="city"
                defaultValue={params.city || ''}
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
            </label>

            <label>
              Lloji i pronës
              <select
                name="type"
                defaultValue={params.type || ''}
              >
                <option value="">Të gjitha llojet</option>
                <option value="Apartament">Apartament</option>
                <option value="Shtëpi">Shtëpi</option>
                <option value="Vilë">Vilë</option>
                <option value="Lokal">Lokal</option>
                <option value="Truall">Truall</option>
              </select>
            </label>

            <label>
              Çmimi minimal (€)
              <input
                name="minPrice"
                type="number"
                min="0"
                defaultValue={params.minPrice || ''}
                placeholder="0"
              />
            </label>

            <label>
              Çmimi maksimal (€)
              <input
                name="maxPrice"
                type="number"
                min="0"
                defaultValue={params.maxPrice || ''}
                placeholder="Pa kufi"
              />
            </label>

            <label>
              Minimumi i dhomave
              <select
                name="bedrooms"
                defaultValue={params.bedrooms || ''}
              >
                <option value="">Çfarëdo</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </label>

            <label>
              Minimumi i banjove
              <select
                name="bathrooms"
                defaultValue={params.bathrooms || ''}
              >
                <option value="">Çfarëdo</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </label>

            <label>
              Sipërfaqja minimale (m²)
              <input
                name="minArea"
                type="number"
                min="0"
                defaultValue={params.minArea || ''}
                placeholder="p.sh. 80"
              />
            </label>

            <label>
              Vizitë virtuale
              <select
                name="tour360"
                defaultValue={params.tour360 || ''}
              >
                <option value="">Të gjitha pronat</option>
                <option value="yes">Vetëm me vizitë 360°</option>
              </select>
            </label>
          </div>
        </form>

        <div className="resultsHead advancedResultsHead">
          <div>
            <h2>
              {properties.length}{' '}
              {properties.length === 1 ? 'pronë' : 'prona'}
            </h2>

            <p className="sectionLead">
              Rezultatet sipas filtrave të zgjedhur.
            </p>
          </div>

          <form action="/kerko" method="get">
            {Object.entries(params).map(([key, value]) => {
              if (!value || key === 'sort') return null;

              return (
                <input
                  key={key}
                  type="hidden"
                  name={key}
                  value={value}
                />
              );
            })}

            <select
              name="sort"
              defaultValue={params.sort || ''}
              aria-label="Rendit rezultatet"
            >
              <option value="">Më të fundit</option>
              <option value="price-low">
                Çmimi: nga më i ulëti
              </option>
              <option value="price-high">
                Çmimi: nga më i larti
              </option>
              <option value="area-high">
                Sipërfaqja: nga më e madhja
              </option>
            </select>

            <button type="submit">Rendit</button>
          </form>
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
            <Search size={36} />

            <h2>Nuk u gjet asnjë pronë</h2>

            <p>
              Provo të ndryshosh çmimin, qytetin ose numrin e
              dhomave.
            </p>

            <Link href="/kerko" className="darkButton">
              Pastro filtrat
            </Link>
          </div>
        )}
      </main>
    </>
  );
}