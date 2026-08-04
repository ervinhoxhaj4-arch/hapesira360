import { NextResponse } from 'next/server';

function extractCoordinates(value: string) {
  const decoded = decodeURIComponent(value);

  const patterns = [
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /!3d(-?\d+(?:\.\d+)?).*?!4d(-?\d+(?:\.\d+)?)/,
    /[?&](?:q|query|ll|center)=(-?\d+(?:\.\d+)?)[,%20]+(-?\d+(?:\.\d+)?)/i,
  ];

  for (const pattern of patterns) {
    const match = decoded.match(pattern);

    if (match) {
      const latitude = Number(match[1]);
      const longitude = Number(match[2]);

      if (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude)
      ) {
        return {
          latitude,
          longitude,
        };
      }
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const googleMapsUrl = String(
      body.googleMapsUrl || ''
    ).trim();

    if (!googleMapsUrl) {
      return NextResponse.json(
        { error: 'Google Maps URL is required.' },
        { status: 400 }
      );
    }

    const parsedUrl = new URL(googleMapsUrl);

    const allowed =
      parsedUrl.hostname === 'maps.app.goo.gl' ||
      parsedUrl.hostname === 'goo.gl' ||
      parsedUrl.hostname === 'google.com' ||
      parsedUrl.hostname.endsWith('.google.com');

    if (!allowed) {
      return NextResponse.json(
        { error: 'This is not a valid Google Maps link.' },
        { status: 400 }
      );
    }

    const directCoordinates =
      extractCoordinates(googleMapsUrl);

    if (directCoordinates) {
      return NextResponse.json(directCoordinates);
    }

    const response = await fetch(googleMapsUrl, {
      redirect: 'follow',
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const resolvedCoordinates =
      extractCoordinates(response.url);

    if (!resolvedCoordinates) {
      return NextResponse.json(
        {
          error:
            'The exact location could not be detected from this link. Copy the link again after selecting the exact pin in Google Maps.',
        },
        { status: 422 }
      );
    }

    return NextResponse.json(resolvedCoordinates);
  } catch {
    return NextResponse.json(
      {
        error:
          'The Google Maps link could not be processed.',
      },
      { status: 500 }
    );
  }
}