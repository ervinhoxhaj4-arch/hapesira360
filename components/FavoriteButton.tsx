'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

type FavoriteButtonProps = {
  propertyId: string;
};

export default function FavoriteButton({
  propertyId,
}: FavoriteButtonProps) {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('favorites');
      const favorites: string[] = stored
        ? JSON.parse(stored)
        : [];

      setSaved(favorites.includes(propertyId));
    } catch {
      setSaved(false);
    } finally {
      setReady(true);
    }
  }, [propertyId]);

  function toggleFavorite() {
    try {
      const stored = localStorage.getItem('favorites');
      const favorites: string[] = stored
        ? JSON.parse(stored)
        : [];

      const updatedFavorites = favorites.includes(propertyId)
        ? favorites.filter((id) => id !== propertyId)
        : [...favorites, propertyId];

      localStorage.setItem(
        'favorites',
        JSON.stringify(updatedFavorites)
      );

      setSaved(updatedFavorites.includes(propertyId));
    } catch {
      setSaved(false);
    }
  }

  if (!ready) {
    return (
      <span
        className="favoriteButton favoriteButtonLoading"
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      className={`favoriteButton ${saved ? 'active' : ''}`}
      onClick={toggleFavorite}
      aria-label={
        saved
          ? 'Hiqe nga të preferuarat'
          : 'Ruaje te të preferuarat'
      }
      title={
        saved
          ? 'Hiqe nga të preferuarat'
          : 'Ruaje te të preferuarat'
      }
    >
      <Heart
        size={23}
        strokeWidth={2.2}
        fill={saved ? 'currentColor' : 'none'}
      />
    </button>
  );
}