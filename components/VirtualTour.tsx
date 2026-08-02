'use client';

import { useState } from 'react';
import { ExternalLink, Maximize2, ScanLine } from 'lucide-react';

type VirtualTourProps = {
  url: string;
  title: string;
};

function getEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes('kuula.co')) {
      parsedUrl.searchParams.set('logo', '0');
      parsedUrl.searchParams.set('info', '0');
      parsedUrl.searchParams.set('fs', '1');
      parsedUrl.searchParams.set('vr', '1');
      parsedUrl.searchParams.set('zoom', '1');
      parsedUrl.searchParams.set('thumbs', '1');

      return parsedUrl.toString();
    }

    return url;
  } catch {
    return url;
  }
}

export default function VirtualTour({
  url,
  title,
}: VirtualTourProps) {
  const [loaded, setLoaded] = useState(false);

  const embedUrl = getEmbedUrl(url);

  return (
    <section className="embeddedTourSection">
      <div className="embeddedTourHeading">
        <div>
          <p className="eyebrow">Vizitë virtuale</p>
          <h2>Hyr në pronë në 360°</h2>
          <p>
            Eksploro ambientet direkt nga telefoni ose kompjuteri.
          </p>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="openTourButton"
        >
          <ExternalLink size={17} />
          Hap në ekran të plotë
        </a>
      </div>

      <div className="embeddedTour">
        {!loaded && (
          <div className="tourLoading">
            <ScanLine size={36} />
            <strong>Duke ngarkuar vizitën 360°...</strong>
          </div>
        )}

        <iframe
          src={embedUrl}
          title={`Vizita virtuale 360° – ${title}`}
          allow="accelerometer; gyroscope; autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />

        <span className="tourFullscreenHint">
          <Maximize2 size={15} />
          Mund ta hapësh në ekran të plotë
        </span>
      </div>
    </section>
  );
}