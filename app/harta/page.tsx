import Header from '@/components/Header';
import PropertiesMap from '@/components/PropertiesMap';
import { getPublishedProperties } from '@/lib/properties';

export const revalidate = 0;

export default async function MapPage() {
  const properties = await getPublishedProperties(true);

  return (
    <>
      <Header />

      <main className="mapPage">
        <div className="container mapPageHead">
          <p className="eyebrow">Prona në hartë</p>
          <h1>Eksploro pronat sipas lokacionit</h1>
          <p className="sectionLead">
            Kliko një pikë në hartë për të parë detajet e pronës.
          </p>
        </div>

        <div className="container">
          <PropertiesMap properties={properties} />
        </div>
      </main>
    </>
  );
}