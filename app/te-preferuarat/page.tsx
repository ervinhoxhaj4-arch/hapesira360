import Header from '@/components/Header';
import FavoritesList from '@/components/FavoritesList';
import { getPublishedProperties } from '@/lib/properties';

export const revalidate = 0;

export default async function FavoritesPage() {
  const properties = await getPublishedProperties(true);

  return (
    <>
      <Header />

      <main className="pageTop container">
        <p className="eyebrow">Pronat e ruajtura</p>
        <h1>Të preferuarat</h1>

        <p className="sectionLead favoritesLead">
          Pronat që ke ruajtur në këtë pajisje.
        </p>

        <FavoritesList properties={properties} />
      </main>
    </>
  );
}