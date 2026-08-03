import Header from '@/components/Header';
import PropertiesMap from '@/components/PropertiesMap';
import { getPublishedProperties } from '@/lib/properties';

export const revalidate = 0;

export default async function EnglishMapPage() {
  const properties = await getPublishedProperties(true);

  return (
    <>
      <Header />

      <main className="pageTop container">
        <div className="advancedSearchHeading">
          <div>
            <p className="eyebrow">
              Property map
            </p>

            <h1>Explore properties on the map</h1>

            <p className="sectionLead">
              View available properties by location and open each listing directly from the map.
            </p>
          </div>
        </div>

        <PropertiesMap properties={properties} />
      </main>
    </>
  );
}