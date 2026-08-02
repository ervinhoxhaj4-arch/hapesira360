'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

import type { UiProperty } from '@/lib/types';

const MapContainer = dynamic(
  () =>
    import('react-leaflet').then((module) => module.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () =>
    import('react-leaflet').then((module) => module.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((module) => module.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((module) => module.Popup),
  { ssr: false }
);

type PropertiesMapProps = {
  properties: UiProperty[];
};

export default function PropertiesMap({
  properties,
}: PropertiesMapProps) {
  const [ready, setReady] = useState(false);

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
      properties.filter(
        (property) =>
          Number.isFinite(property.latitude) &&
          Number.isFinite(property.longitude) &&
          property.latitude !== null &&
          property.longitude !== null
      ),
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
          Shto latitude dhe longitude te pronat për t’i shfaqur
          në hartë.
        </p>
      </div>
    );
  }

  return (
    <div className="propertiesMapWrap">
      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom
        className="propertiesMap"
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
                  €{Number(property.price).toLocaleString('de-DE')}
                  {property.purpose === 'qira' ? ' / muaj' : ''}
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
  );
}