import Header from '@/components/Header';
import FavoritesList from '@/components/FavoritesList';
import { getPublishedProperties } from '@/lib/properties';

export const revalidate = 0;

export default async function EnglishFavoritesPage() {
  const properties = await getPublishedProperties(true);

  return (
    <>
      <Header />

      <main className="pageTop container">
        <p className="eyebrow">
          Saved properties
        </p>

        <h1>Favorites</h1>

        <p className="sectionLead favoritesLead">
          Properties you have saved on this device.
        </p>

        <FavoritesList properties={properties} />
      </main>
    </>
  );
}