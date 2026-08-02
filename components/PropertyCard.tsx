import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Bath, Maximize2, ScanLine } from 'lucide-react';
import type { DbProperty } from '@/lib/types';

export default function PropertyCard({
  property,
}: {
  property: DbProperty;
}) {
  const price =
    property.status === 'rent'
      ? `€${property.price.toLocaleString('de-DE')} / muaj`
      : `€${property.price.toLocaleString('de-DE')}`;

  const coverImage =
    property.cover_image ||
    property.property_images?.find((image) => image.cover)?.image_url ||
    property.property_images?.[0]?.image_url ||
    '/logo-icon.png';

  return (
    <Link href={`/prona/${property.id}`} className="propertyCard">
      <div className="cardImageWrap">
        <Image
          src={coverImage}
          alt={property.title}
          fill
          sizes="(max-width: 800px) 100vw, 33vw"
          className="cardImage"
        />

        <span className="purposeBadge">
          {property.status === 'rent' ? 'Me Qira' : 'Në Shitje'}
        </span>

        {property.tour360_url && (
          <span className="tourBadge">
            <ScanLine size={15} /> 360°
          </span>
        )}
      </div>

      <div className="cardBody">
        <p className="eyebrow">
          {property.city}
          {property.address ? ` · ${property.address}` : ''}
        </p>

        <h3>{property.title}</h3>
        <p className="price">{price}</p>

        <div className="facts">
          <span>
            <BedDouble size={17} />
            {property.bedrooms ?? 0}
          </span>

          <span>
            <Bath size={17} />
            {property.bathrooms ?? 0}
          </span>

          <span>
            <Maximize2 size={17} />
            {property.area ?? 0} m²
          </span>
        </div>
      </div>
    </Link>
  );
}