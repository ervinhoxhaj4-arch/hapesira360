import Header from '@/components/Header';
import { getPublishedProperty, getPublishedProperties } from '@/lib/properties';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Bath, BedDouble, MapPin, Maximize2, ScanLine, MessageCircle } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';

export const revalidate = 0;

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getPublishedProperty(id);
  if (!property) notFound();
  const allProperties = await getPublishedProperties(true);
  const price = property.purpose === 'qira' ? `€${property.price.toLocaleString('de-DE')} / muaj` : `€${property.price.toLocaleString('de-DE')}`;
  const mapsLink = property.googleMapsUrl || `https://www.google.com/maps?q=${property.latitude},${property.longitude}`;
  return <><Header/><main><section className="propertyHero"><Image src={property.coverImage} alt={property.title} fill priority className="propertyHeroImage"/><div className="propertyHeroShade"/><div className="container propertyHeroText"><p>{property.city}{property.neighborhood ? ` · ${property.neighborhood}` : ''}</p><h1>{property.title}</h1><strong>{price}</strong></div></section><section className="container propertyContent"><div className="propertyMain"><div className="propertyFacts"><span><BedDouble/> <b>{property.bedrooms}</b> Dhoma</span><span><Bath/> <b>{property.bathrooms}</b> Banjo</span><span><Maximize2/> <b>{property.area}</b> m²</span>{property.floor && <span><b>{property.floor}</b> Kati</span>}</div>{property.tour360Url && <section className="tourSection"><div><p className="eyebrow">Vizitë virtuale</p><h2>Hyr në pronë në 360°</h2><p>Eksploro hapësirat nga telefoni ose kompjuteri.</p></div><a href={property.tour360Url} target="_blank" rel="noreferrer" className="tourButton"><ScanLine/> Shiko në 360°</a></section>}<section><p className="eyebrow">Galeria</p><h2>Fotografitë</h2><div className="gallery">{property.images.map((image,index)=><div key={`${image}-${index}`} className={index===0?'galleryLarge':''}><Image src={image} alt={`${property.title} ${index+1}`} fill className="galleryImage"/></div>)}</div></section><section className="description"><p className="eyebrow">Rreth pronës</p><h2>Përshkrimi</h2><p>{property.description || 'Kontakto Hapësira360 për më shumë informacion.'}</p></section><section><p className="eyebrow">Vendndodhja</p><h2>{property.city}{property.neighborhood ? `, ${property.neighborhood}` : ''}</h2><div className="mapBox"><MapPin size={34}/><p>Google Maps</p><a target="_blank" rel="noreferrer" href={mapsLink}>Hap vendndodhjen</a></div></section></div><aside className="contactCard"><p className="eyebrow">Interesohesh për këtë pronë?</p><h3>Kontakto Hapësira360</h3><a href="https://wa.me/38344111222"><MessageCircle/> WhatsApp</a><small>ID e pronës: {property.id}</small></aside></section><section className="container section"><div className="sectionHeading"><h2>Prona të tjera</h2><Link href="/kerko">Shiko të gjitha</Link></div><div className="propertyGrid">{allProperties.filter(p=>p.id!==property.id).slice(0,2).map(p=><PropertyCard key={p.id} property={p}/>)}</div></section></main></>;
}
