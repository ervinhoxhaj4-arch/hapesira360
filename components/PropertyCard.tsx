import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Bath, Maximize2, ScanLine } from 'lucide-react';
import type { Property } from '@/lib/types';

export default function PropertyCard({ property }: { property: Property }) {
  const price = property.purpose === 'qira'
    ? `€${property.price.toLocaleString('de-DE')} / muaj`
    : `€${property.price.toLocaleString('de-DE')}`;

  return (
    <Link href={`/prona/${property.id}`} className="propertyCard">
      <div className="cardImageWrap">
        <Image src={property.coverImage} alt={property.title} fill sizes="(max-width: 800px) 100vw, 33vw" className="cardImage" />
        <span className="purposeBadge">{property.purpose === 'qira' ? 'Me Qira' : 'Në Shitje'}</span>
        {property.tour360Url && <span className="tourBadge"><ScanLine size={15} /> 360°</span>}
      </div>
      <div className="cardBody">
        <p className="eyebrow">{property.city} · {property.neighborhood}</p>
        <h3>{property.title}</h3>
        <p className="price">{price}</p>
        <div className="facts">
          <span><BedDouble size={17}/>{property.bedrooms}</span>
          <span><Bath size={17}/>{property.bathrooms}</span>
          <span><Maximize2 size={17}/>{property.area} m²</span>
        </div>
      </div>
    </Link>
  );
}
