import ViewingRequest from '@/components/ViewingRequest';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import PropertyGallery from '@/components/PropertyGallery';
import {
  getPublishedProperties,
  getPublishedProperty,
} from '@/lib/properties';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  Bath,
  BedDouble,
  Building,
  ExternalLink,
  MapPin,
  Maximize2,
  MessageCircle,
  ScanLine,
} from 'lucide-react';

export const revalidate = 0;

type PropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyPage({
  params,
}: PropertyPageProps) {
  const { id } = await params;

  const property = await getPublishedProperty(id);

  if (!property) {
    notFound();
  }

  const allProperties = await getPublishedProperties(true);

  const relatedProperties = allProperties
    .filter((item) => item.id !== property.id)
    .filter(
      (item) =>
        item.city.toLowerCase() === property.city.toLowerCase() ||
        item.type === property.type
    )
    .slice(0, 3);

  const fallbackProperties = allProperties
    .filter((item) => item.id !== property.id)
    .slice(0, 3);

  const displayedProperties =
    relatedProperties.length > 0
      ? relatedProperties
      : fallbackProperties;

  const price =
    property.purpose === 'qira'
      ? `€${Number(property.price).toLocaleString('de-DE')} / muaj`
      : `€${Number(property.price).toLocaleString('de-DE')}`;

  const mapsLink =
    property.googleMapsUrl ||
    (property.latitude && property.longitude
      ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}`
      : '');

  const mapEmbedUrl =
    property.latitude && property.longitude
      ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`
      : '';

  const images =
    property.images.length > 0
      ? property.images
      : [property.coverImage];

  const whatsappMessage = encodeURIComponent(
    `Përshëndetje, jam i interesuar për pronën "${property.title}" me ID: ${property.id}`
  );

  /*
    Ndrysho numrin më poshtë me numrin real të Hapësira360.
    Formati: kodi i shtetit + numri, pa + dhe pa hapësira.
    Shembull Kosovë: 38344111222
  */
  const whatsappNumber = '38343589529';

  const whatsappLink =
    `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      <Header />

      <main>
        <section className="propertyHero">
          <Image
            src={property.coverImage}
            alt={property.title}
            fill
            priority
            sizes="100vw"
            className="propertyHeroImage"
          />

          <div className="propertyHeroShade" />

          <div className="container propertyHeroText">
            <p className="propertyLocation">
              <MapPin size={18} />

              {property.city}

              {property.neighborhood
                ? ` · ${property.neighborhood}`
                : ''}
            </p>

            <h1>{property.title}</h1>

            <div className="propertyHeroBottom">
              <strong>{price}</strong>

              <span className="propertyPurpose">
                {property.purpose === 'qira'
                  ? 'Me Qira'
                  : 'Në Shitje'}
              </span>
            </div>
          </div>
        </section>

        <section className="container propertyContent">
          <div className="propertyMain">
            <div className="propertyFacts">
              <span>
                <BedDouble />
                <b>{property.bedrooms || 0}</b>
                Dhoma
              </span>

              <span>
                <Bath />
                <b>{property.bathrooms || 0}</b>
                Banjo
              </span>

              <span>
                <Maximize2 />
                <b>{property.area || 0}</b>
                m²
              </span>

              {property.floor !== null &&
                property.floor !== undefined && (
                  <span>
                    <Building />
                    <b>{property.floor}</b>
                    Kati
                  </span>
                )}
            </div>

            {property.tour360Url && (
              <section className="tourSection">
                <div>
                  <p className="eyebrow">
                    Vizitë virtuale
                  </p>

                  <h2>Hyr në pronë në 360°</h2>

                  <p>
                    Eksploro çdo hapësirë nga telefoni,
                    tableti ose kompjuteri.
                  </p>
                </div>

                <a
                  href={property.tour360Url}
                  target="_blank"
                  rel="noreferrer"
                  className="tourButton"
                >
                  <ScanLine />
                  Shiko në 360°
                  <ExternalLink size={17} />
                </a>
              </section>
            )}

            <section className="propertyGallerySection">
              <div className="propertySectionHeading">
                <div>
                  <p className="eyebrow">Galeria</p>
                  <h2>Fotografitë e pronës</h2>
                </div>

                <span>
                  {images.length}{' '}
                  {images.length === 1
                    ? 'fotografi'
                    : 'fotografi'}
                </span>
              </div>

<PropertyGallery
  images={images}
  title={property.title}
/>
            </section>

            <section className="description">
              <p className="eyebrow">Rreth pronës</p>
              <h2>Përshkrimi</h2>

              <p>
                {property.description ||
                  'Kontakto Hapësira360 për më shumë informacion rreth kësaj prone.'}
              </p>
            </section>

            <section className="locationSection">
              <p className="eyebrow">Vendndodhja</p>

              <h2>
                {property.city}

                {property.neighborhood
                  ? `, ${property.neighborhood}`
                  : ''}
              </h2>

              {mapEmbedUrl ? (
                <div className="propertyMap">
                  <iframe
                    src={mapEmbedUrl}
                    title={`Vendndodhja e ${property.title}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="mapBox">
                  <MapPin size={34} />
                  <p>
                    Vendndodhja e saktë nuk është vendosur.
                  </p>
                </div>
              )}

              {mapsLink && (
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mapsButton"
                >
                  <MapPin size={18} />
                  Hap në Google Maps
                  <ExternalLink size={16} />
                </a>
              )}
            </section>
          </div>

          <aside className="contactCard">
            <p className="eyebrow">
              Interesohesh për këtë pronë?
            </p>

            <h3>Kontakto Hapësira360</h3>

            <p className="contactCardText">
              Na shkruaj dhe do të të ndihmojmë me
              informacion shtesë ose caktimin e një vizite.
            </p>

            <div className="contactPropertyPrice">
              <span>Çmimi</span>
              <strong>{price}</strong>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="whatsappButton"
            >
              <MessageCircle />
              Kontakto në WhatsApp
            </a>
            <ViewingRequest
  propertyId={property.id}
  propertyTitle={property.title}
/>

            <Link
              href="/#kontakt"
              className="secondaryContactButton"
            >
              Na kontakto
            </Link>

            <small>
              ID e pronës:
              <br />
              <b>{property.id}</b>
            </small>
          </aside>
        </section>

        {displayedProperties.length > 0 && (
          <section className="container section">
            <div className="sectionHeading">
              <div>
                <p className="eyebrow">
                  Mund të të interesojnë
                </p>

                <h2>Prona të tjera</h2>
              </div>

              <Link href="/kerko">
                Shiko të gjitha
                <ExternalLink size={17} />
              </Link>
            </div>

            <div className="propertyGrid">
              {displayedProperties.map((item) => (
                <PropertyCard
                  key={item.id}
                  property={item}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}