'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';

import PropertyCard from '@/components/PropertyCard';
import type { UiProperty } from '@/lib/types';

type FavoritesListProps = {
  properties: UiProperty[];
};

export default function FavoritesList({
  properties,
}: FavoritesListProps) {
  const pathname = usePathname();

  const isEnglish =
    pathname === '/en' ||
    pathname.startsWith('/en/');

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('favorites') || '[]'
      );

      setFavoriteIds(
        Array.isArray(saved)
          ? saved
          : []
      );
    } catch {
      setFavoriteIds([]);
    } finally {
      setReady(true);
    }
  }, []);

  const favoriteProperties = properties.filter(
    (property) =>
      favoriteIds.includes(property.id)
  );

  if (!ready) {
    return (
      <div className="favoritesLoading">
        {isEnglish
          ? 'Loading saved properties...'
          : 'Duke ngarkuar pronat e ruajtura...'}
      </div>
    );
  }

  if (favoriteProperties.length === 0) {
    return (
      <div className="favoritesEmpty">
        <Heart size={38} />

        <h2>
          {isEnglish
            ? 'You have not saved any properties yet'
            : 'Nuk ke ruajtur ende prona'}
        </h2>

        <p>
          {isEnglish
            ? 'Click the heart icon on a property to save it here.'
            : 'Kliko ikonën e zemrës në një pronë për ta ruajtur këtu.'}
        </p>

        <a
          href={
            isEnglish
              ? '/en/kerko'
              : '/kerko'
          }
          className="darkButton"
        >
          {isEnglish
            ? 'Explore properties'
            : 'Eksploro pronat'}
        </a>
      </div>
    );
  }

  return (
    <div className="propertyGrid">
      {favoriteProperties.map(
        (property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        )
      )}
    </div>
  );
}