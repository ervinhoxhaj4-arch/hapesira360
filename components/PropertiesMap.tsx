'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

import type { UiProperty } from '@/lib/types';

const MapContainer = dynamic(
  () =>
    import('react-leaflet').then(
      (module) => module.MapContainer
    ),
  { ssr: false }
);

const TileLayer = dynamic(
  () =>
    import('react-leaflet').then(
      (module) => module.TileLayer
    ),
  { ssr: false }
);

const Marker = dynamic(
  () =>
    import('react-leaflet').then(
      (module) => module.Marker
    ),
  { ssr: false }
);

const Popup = dynamic(
  () =>
    import('react-leaflet').then(
      (module) => module.Popup
    ),
  { ssr: false }
);

type PropertiesMapProps = {
  properties: UiProperty[];
};

export default function PropertiesMap({
  properties,
}: PropertiesMapProps) {
  const [ready, setReady] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] =
    useState<string | null>(null);

  useEffect(() => {
    async function prepareLeaflet() {
      const L = await import('leaflet');

      delete (
        L.Icon.Default.prototype as {
          _getIconUrl?: unknown;
        }
      )._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      setReady(true);
    }

    void prepareLeaflet();
  }, []);

  const mappedProperties = useMemo(
    () =>
      properties.filter((property) => {
        const latitude = Number(property.latitude);
        const longitude = Number(property.longitude);

        return (
          property.latitude !== null &&
          property.longitude !== null &&
          Number.isFinite(latitude) &&
          Number.isFinite(longitude) &&
          latitude !== 0 &&
          longitude !== 0
        );
      }),
    [properties]
  );

  const center = useMemo<[number, number]>(() => {
    if (mappedProperties.length === 0) {
      return [42.6026, 20.903];
    }

    const latitudeAverage =
      mappedProperties.reduce(
        (total, property) =>
          total + Number(property.latitude),
        0
      ) / mappedProperties.length;

    const longitudeAverage =
      mappedProperties.reduce(
        (total, property) =>
          total + Number(property.longitude),
        0
      ) / mappedProperties.length;

    return [latitudeAverage, longitudeAverage];
  }, [mappedProperties]);

  if (!ready) {
    return (
      <div className="propertiesMapLoading">
        Duke ngarkuar hartën...
      </div>
    );
  }

  if (mappedProperties.length === 0) {
    return (
      <div className="propertiesMapEmpty">
        <MapPin size={34} />

        <h2>Nuk ka prona me koordinata</h2>

        <p>
          Shto latitude dhe longitude te pronat për t’i
          shfaqur në hartë.
        </p>
      </div>
    );
  }

  return (
    <div className="mapSearchLayout">
      <aside className="mapResultsPanel">
        <div className="mapResultsHead">
          <div>
            <p className="eyebrow">Rezultatet</p>
            <h2>
              {mappedProperties.length}{' '}
              {mappedProperties.length === 1
                ? 'pronë'
                : 'prona'}
            </h2>
          </div>
        </div>

        <div className="mapPropertyList">
          {mappedProperties.map((property) => {
            const isSelected =
              selectedPropertyId === property.id;

            const price =
              property.purpose === 'qira'
                ? `€${Number(property.price).toLocaleString(
                    'de-DE'
                  )} / muaj`
                : `€${Number(property.price).toLocaleString(
                    'de-DE'
                  )}`;

            return (
              <button
                type="button"
                key={property.id}
                className={`mapPropertyItem ${
                  isSelected ? 'active' : ''
                }`}
                onClick={() =>
                  setSelectedPropertyId(property.id)
                }
              >
                <div className="mapPropertyImage">
                  <Image
                    src={property.coverImage}
                    alt={property.title}
                    fill
                    sizes="180px"
                  />
                </div>

                <div className="mapPropertyInfo">
                  <span>
                    {property.city}
                    {property.neighborhood
                      ? ` · ${property.neighborhood}`
                      : ''}
                  </span>

                  <strong>{property.title}</strong>

                  <b>{price}</b>

                  <small>
                    {property.area || 0} m² ·{' '}
                    {property.bedrooms || 0} dhoma
                  </small>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="propertiesMapWrap splitMapWrap">
        <MapContainer
          center={center}
          zoom={9}
          scrollWheelZoom
          className="propertiesMap splitPropertiesMap"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mappedProperties.map((property) => (
            <Marker
              key={property.id}
              position={[
                Number(property.latitude),
                Number(property.longitude),
              ]}
              eventHandlers={{
                click: () =>
                  setSelectedPropertyId(property.id),
              }}
            >
              <Popup>
                <div className="mapPopup">
                  <strong>{property.title}</strong>

                  <span>
                    {property.city}
                    {property.neighborhood
                      ? ` · ${property.neighborhood}`
                      : ''}
                  </span>

                  <b>
                    €
                    {Number(property.price).toLocaleString(
                      'de-DE'
                    )}
                    {property.purpose === 'qira'
                      ? ' / muaj'
                      : ''}
                  </b>

                  <Link href={`/prona/${property.id}`}>
                    Shiko pronën
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}