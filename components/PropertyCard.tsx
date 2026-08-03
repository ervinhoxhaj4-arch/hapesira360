'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bath,
  BedDouble,
  Maximize2,
  ScanLine,
} from 'lucide-react';

import type { UiProperty } from '@/lib/types';

export default function PropertyCard({
  property,
}: {
  property: UiProperty;
}) {
  const pathname = usePathname();

  const isEnglish =
    pathname === '/en' ||
    pathname.startsWith('/en/');

  const propertyLink = isEnglish
    ? `/en/prona/${property.id}`
    : `/prona/${property.id}`;

  const price =
    property.purpose === 'qira'
      ? isEnglish
        ? `€${property.price.toLocaleString('de-DE')} / month`
        : `€${property.price.toLocaleString('de-DE')} / muaj`
      : `€${property.price.toLocaleString('de-DE')}`;

  return (
    <Link
      href={propertyLink}
      className="propertyCard"
    >
      <div className="cardImageWrap">
        <Image
          src={property.coverImage}
          alt={property.title}
          fill
          sizes="(max-width: 800px) 100vw, 33vw"
          className="cardImage"
        />

        <span className="purposeBadge">
          {property.purpose === 'qira'
            ? isEnglish
              ? 'For Rent'
              : 'Me Qira'
            : isEnglish
              ? 'For Sale'
              : 'Në Shitje'}
        </span>

        {property.featured && (
          <span className="featuredBadge">
            ⭐ {isEnglish ? 'FEATURED' : 'E VEÇUAR'}
          </span>
        )}

        {property.tour360Url && (
          <span className="tourBadge">
            <ScanLine size={15} />
            360°
          </span>
        )}
      </div>

      <div className="cardBody">
        <p className="eyebrow">
          {property.city}

          {property.neighborhood
            ? ` · ${property.neighborhood}`
            : ''}
        </p>

        <h3>{property.title}</h3>

        <p className="price">{price}</p>

        <div className="facts">
          <span
            title={
              isEnglish
                ? 'Bedrooms'
                : 'Dhoma'
            }
          >
            <BedDouble size={17} />
            {property.bedrooms}
          </span>

          <span
            title={
              isEnglish
                ? 'Bathrooms'
                : 'Banjo'
            }
          >
            <Bath size={17} />
            {property.bathrooms}
          </span>

          <span
            title={
              isEnglish
                ? 'Area'
                : 'Sipërfaqja'
            }
          >
            <Maximize2 size={17} />
            {property.area} m²
          </span>
        </div>
      </div>
    </Link>
  );
}