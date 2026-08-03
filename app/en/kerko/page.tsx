import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { getPublishedProperties } from '@/lib/properties';
import {
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
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

export default async function EnglishSearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  let properties = await getPublishedProperties(true);

  if (
    params.purpose === 'shitje' ||
    params.purpose === 'qira'
  ) {
    properties = properties.filter(
      (property) =>
        property.purpose === params.purpose
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
        property.type.toLowerCase() ===
        params.type?.toLowerCase()
    );
  }

  const minPrice = Number(params.minPrice);

  if (
    params.minPrice &&
    Number.isFinite(minPrice)
  ) {
    properties = properties.filter(
      (property) =>
        Number(property.price) >= minPrice
    );
  }

  const maxPrice = Number(params.maxPrice);

  if (
    params.maxPrice &&
    Number.isFinite(maxPrice)
  ) {
    properties = properties.filter(
      (property) =>
        Number(property.price) <= maxPrice
    );
  }

  const bedrooms = Number(params.bedrooms);

  if (
    params.bedrooms &&
    Number.isFinite(bedrooms)
  ) {
    properties = properties.filter(
      (property) =>
        Number(property.bedrooms || 0) >= bedrooms
    );
  }

  const bathrooms = Number(params.bathrooms);

  if (
    params.bathrooms &&
    Number.isFinite(bathrooms)
  ) {
    properties = properties.filter(
      (property) =>
        Number(property.bathrooms || 0) >= bathrooms
    );
  }

  const minArea = Number(params.minArea);

  if (
    params.minArea &&
    Number.isFinite(minArea)
  ) {
    properties = properties.filter(
      (property) =>
        Number(property.area || 0) >= minArea
    );
  }

  if (params.tour360 === 'yes') {
    properties = properties.filter(
      (property) =>
        Boolean(property.tour360Url)
    );
  }

  if (params.sort === 'price-low') {
    properties.sort(
      (a, b) =>
        Number(a.price) - Number(b.price)
    );
  }

  if (params.sort === 'price-high') {
    properties.sort(
      (a, b) =>
        Number(b.price) - Number(a.price)
    );
  }

  if (params.sort === 'area-high') {
    properties.sort(
      (a, b) =>
        Number(b.area || 0) -
        Number(a.area || 0)
    );
  }

  const hasActiveFilters =
    Object.entries(params).some(
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
            <p className="eyebrow">
              Properties in Kosovo
            </p>

            <h1>Find your property</h1>

            <p className="sectionLead">
              Filter listings by location, price,
              and property features.
            </p>
          </div>

          {hasActiveFilters && (
            <Link
              href="/en/kerko"
              className="clearFiltersButton"
            >
              <X size={17} />
              Clear filters
            </Link>
          )}
        </div>

        <form
          className="advancedFilterPanel"
          action="/en/kerko"
          method="get"
        >
          <div className="advancedFilterTop">
            <div>
              <SlidersHorizontal size={21} />

              <strong>Search filters</strong>
            </div>

            <button type="submit">
              <Search size={18} />
              Search properties
            </button>
          </div>

          <div className="advancedFilterGrid">
            <label>
              Listing purpose

              <select
                name="purpose"
                defaultValue={
                  params.purpose || ''
                }
              >
                <option value="">
                  For sale and rent
                </option>

                <option value="shitje">
                  For sale
                </option>

                <option value="qira">
                  For rent
                </option>
              </select>
            </label>

            <label>
              City

              <select
                name="city"
                defaultValue={params.city || ''}
              >
                <option value="">
                  All cities
                </option>

                <option value="Prizren">
                  Prizren
                </option>

                <option value="Prishtinë">
                  Prishtina
                </option>

                <option value="Ferizaj">
                  Ferizaj
                </option>

                <option value="Pejë">
                  Peja
                </option>

                <option value="Gjakovë">
                  Gjakova
                </option>

                <option value="Gjilan">
                  Gjilan
                </option>

                <option value="Mitrovicë">
                  Mitrovica
                </option>
              </select>
            </label>

            <label>
              Property type

              <select
                name="type"
                defaultValue={params.type || ''}
              >
                <option value="">
                  All property types
                </option>

                <option value="Apartament">
                  Apartment
                </option>

                <option value="Shtëpi">
                  House
                </option>

                <option value="Vilë">
                  Villa
                </option>

                <option value="Lokal">
                  Commercial property
                </option>

                <option value="Truall">
                  Land
                </option>
              </select>
            </label>

            <label>
              Minimum price (€)

              <input
                name="minPrice"
                type="number"
                min="0"
                defaultValue={
                  params.minPrice || ''
                }
                placeholder="0"
              />
            </label>

            <label>
              Maximum price (€)

              <input
                name="maxPrice"
                type="number"
                min="0"
                defaultValue={
                  params.maxPrice || ''
                }
                placeholder="No limit"
              />
            </label>

            <label>
              Minimum bedrooms

              <select
                name="bedrooms"
                defaultValue={
                  params.bedrooms || ''
                }
              >
                <option value="">
                  Any
                </option>

                <option value="1">
                  1+
                </option>

                <option value="2">
                  2+
                </option>

                <option value="3">
                  3+
                </option>

                <option value="4">
                  4+
                </option>

                <option value="5">
                  5+
                </option>
              </select>
            </label>

            <label>
              Minimum bathrooms

              <select
                name="bathrooms"
                defaultValue={
                  params.bathrooms || ''
                }
              >
                <option value="">
                  Any
                </option>

                <option value="1">
                  1+
                </option>

                <option value="2">
                  2+
                </option>

                <option value="3">
                  3+
                </option>
              </select>
            </label>

            <label>
              Minimum area (m²)

              <input
                name="minArea"
                type="number"
                min="0"
                defaultValue={
                  params.minArea || ''
                }
                placeholder="e.g. 80"
              />
            </label>

            <label>
              Virtual tour

              <select
                name="tour360"
                defaultValue={
                  params.tour360 || ''
                }
              >
                <option value="">
                  All properties
                </option>

                <option value="yes">
                  Only properties with 360° tours
                </option>
              </select>
            </label>
          </div>
        </form>

        <div className="resultsHead advancedResultsHead">
          <div>
            <h2>
              {properties.length}{' '}
              {properties.length === 1
                ? 'property'
                : 'properties'}
            </h2>

            <p className="sectionLead">
              Results based on your selected filters.
            </p>
          </div>

          <form
            action="/en/kerko"
            method="get"
          >
            {Object.entries(params).map(
              ([key, value]) => {
                if (
                  !value ||
                  key === 'sort'
                ) {
                  return null;
                }

                return (
                  <input
                    key={key}
                    type="hidden"
                    name={key}
                    value={value}
                  />
                );
              }
            )}

            <select
              name="sort"
              defaultValue={params.sort || ''}
              aria-label="Sort results"
            >
              <option value="">
                Newest first
              </option>

              <option value="price-low">
                Price: lowest first
              </option>

              <option value="price-high">
                Price: highest first
              </option>

              <option value="area-high">
                Area: largest first
              </option>
            </select>

            <button type="submit">
              Sort
            </button>
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

            <h2>No properties found</h2>

            <p>
              Try changing the price, city,
              property type, or number of bedrooms.
            </p>

            <Link
              href="/en/kerko"
              className="darkButton"
            >
              Clear filters
            </Link>
          </div>
        )}
      </main>
    </>
  );
}