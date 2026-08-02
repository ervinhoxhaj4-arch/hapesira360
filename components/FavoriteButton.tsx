'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FavoriteButton({
  propertyId,
}: {
  propertyId: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    );

    setSaved(favorites.includes(propertyId));
  }, [propertyId]);

  function toggleFavorite() {
    const favorites = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    );

    let updated;

    if (favorites.includes(propertyId)) {
      updated = favorites.filter((id: string) => id !== propertyId);
      setSaved(false);
    } else {
      updated = [...favorites, propertyId];
      setSaved(true);
    }

    localStorage.setItem(
      'favorites',
      JSON.stringify(updated)
    );
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      className={`favoriteButton ${saved ? 'active' : ''}`}
    >
      <Heart
        size={19}
        fill={saved ? 'currentColor' : 'none'}
      />
    </button>
  );
}