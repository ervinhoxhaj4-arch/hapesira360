import PropertyViewTracker from '@/components/PropertyViewTracker';
import type { Metadata } from 'next';
import FavoriteButton from '@/components/FavoriteButton';
import ViewingRequest from '@/components/ViewingRequest';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import PropertyGallery from '@/components/PropertyGallery';
import WhatsAppButton from '@/components/WhatsAppButton';

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
  ScanLine,
} from 'lucide-react';

export const revalidate = 0;

type PropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;

  const property = await getPublishedProperty(id);

  if (!property) {
    return {
      title: 'Property not found | Hapësira360',
      description:
        'This property is no longer available.',
    };
  }

  const price =
    property.purpose === 'qira'
      ? `€${Number(property.price).toLocaleString(
          'de-DE'
        )} / month`
      : `€${Number(property.price).toLocaleString(
          'de-DE'
        )}`;

  const description =
    property.description?.slice(0, 155) ||
    `${property.title} in ${property.city}. Price: ${price}. View photos, location and property details on Hapësira360.`;

  const propertyUrl =
    `https://hapesira360.com/en/prona/${property.id}`;

  return {
    title: `${property.title} | Hapësira360`,
    description,

    alternates: {
      canonical: propertyUrl,
      languages: {
        sq: `https://hapesira360.com/prona/${property.id}`,
        en: propertyUrl,
      },
    },

    openGraph: {
      title: property.title,
      description,
      url: propertyUrl,
      siteName: 'Hapësira360',
      locale: 'en_US',
      type: 'website',

      images: [
        {
          url: property.coverImage,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description,
      images: [property.coverImage],
    },
  };
}

export default async function EnglishPropertyPage({
  params,
}: PropertyPageProps) {
  const { id } = await params;

  const property = await getPublishedProperty(id);

  if (!property) {
    notFound();
  }

  const allProperties =
    await getPublishedProperties(true);

  const relatedProperties = allProperties
    .filter(
      (item) => item.id !== property.id
    )
    .filter(
      (item) =>
        item.city.toLowerCase() ===
          property.city.toLowerCase() ||
        item.type === property.type
    )
    .slice(0, 3);

  const fallbackProperties = allProperties
    .filter(
      (item) => item.id !== property.id
    )
    .slice(0, 3);

  const displayedProperties =
    relatedProperties.length > 0
      ? relatedProperties
      : fallbackProperties;

  const price =
    property.purpose === 'qira'
      ? `€${Number(property.price).toLocaleString(
          'de-DE'
        )} / month`
      : `€${Number(property.price).toLocaleString(
          'de-DE'
        )}`;

  const mapsLink =
    property.googleMapsUrl ||
    (property.latitude &&
    property.longitude
      ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}`
      : '');

  const mapEmbedUrl =
    property.latitude &&
    property.longitude
      ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`
      : '';

  const images =
    property.images.length > 0
      ? property.images
      : [property.coverImage];

  const propertyUrl =
    `https://hapesira360.com/en/prona/${property.id}`;

  const whatsappMessage =
    encodeURIComponent(
      `Hello, I am interested in the property "${property.title}". Property ID: ${property.id}\n\n${propertyUrl}`
    );

  const whatsappNumber =
    property.whatsapp ||
    '38343589529';

  const whatsappLink =
    `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      <Header />

      <PropertyViewTracker
        propertyId={property.id}
      />

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

            <div className="propertyTitleRow">
              <h1>{property.title}</h1>

              <FavoriteButton
                propertyId={property.id}
              />
            </div>

            <div className="propertyHeroBottom">
              <strong>{price}</strong>

              <span className="propertyPurpose">
                {property.purpose === 'qira'
                  ? 'For Rent'
                  : 'For Sale'}
              </span>
            </div>
          </div>
        </section>

        <section className="container propertyContent">
          <div className="propertyMain">
            <div className="propertyFacts">
              <span>
                <BedDouble />

                <b>
                  {property.bedrooms || 0}
                </b>

                Bedrooms
              </span>

              <span>
                <Bath />

                <b>
                  {property.bathrooms || 0}
                </b>

                Bathrooms
              </span>

              <span>
                <Maximize2 />

                <b>
                  {property.area || 0}
                </b>

                m²
              </span>

              {property.floor !== null &&
                property.floor !== undefined && (
                  <span>
                    <Building />

                    <b>
                      {property.floor}
                    </b>

                    Floor
                  </span>
                )}
            </div>

            {property.tour360Url && (
              <section className="tourSection">
                <div>
                  <p className="eyebrow">
                    Virtual tour
                  </p>

                  <h2>
                    Explore the property in 360°
                  </h2>

                  <p>
                    Explore every room from your
                    phone, tablet or computer.
                  </p>
                </div>

                <a
                  href={property.tour360Url}
                  target="_blank"
                  rel="noreferrer"
                  className="tourButton"
                >
                  <ScanLine />

                  View the 360° tour

                  <ExternalLink size={17} />
                </a>
              </section>
            )}

            <section className="propertyGallerySection">
              <div className="propertySectionHeading">
                <div>
                  <p className="eyebrow">
                    Gallery
                  </p>

                  <h2>
                    Property photos
                  </h2>
                </div>

                <span>
                  {images.length}{' '}

                  {images.length === 1
                    ? 'photo'
                    : 'photos'}
                </span>
              </div>

              <PropertyGallery
                images={images}
                title={property.title}
              />
            </section>

            <section className="description">
              <p className="eyebrow">
                About the property
              </p>

              <h2>Description</h2>

              <p>
                {property.description ||
                  'Contact Hapësira360 for more information about this property.'}
              </p>
            </section>

            <section className="locationSection">
              <p className="eyebrow">
                Location
              </p>

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
                    title={`Location of ${property.title}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="mapBox">
                  <MapPin size={34} />

                  <p>
                    The exact location has not
                    been provided.
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

                  Open in Google Maps

                  <ExternalLink size={16} />
                </a>
              )}
            </section>
          </div>

          <aside className="contactCard">
            <p className="eyebrow">
              Interested in this property?
            </p>

            <h3>
              Contact Hapësira360
            </h3>

            <p className="contactCardText">
              Send us a message and we will help
              you with additional information or
              arrange a property viewing.
            </p>

            <div className="contactPropertyPrice">
              <span>Price</span>

              <strong>{price}</strong>
            </div>

            <WhatsAppButton
              propertyId={property.id}
              whatsappLink={whatsappLink}
            />

            <ViewingRequest
              propertyId={property.id}
              propertyTitle={property.title}
            />

            <Link
              href="/en/#kontakt"
              className="secondaryContactButton"
            >
              Contact us
            </Link>

            <small>
              Property ID:
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
                  You may also like
                </p>

                <h2>
                  Similar properties
                </h2>
              </div>

              <Link href="/en/kerko">
                View all

                <ExternalLink size={17} />
              </Link>
            </div>

            <div className="propertyGrid">
              {displayedProperties.map(
                (item) => (
                  <PropertyCard
                    key={item.id}
                    property={item}
                  />
                )
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}