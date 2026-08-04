import { NextResponse } from 'next/server';

function extractCoordinates(url: string) {
  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
    /[?&]query=(-?\d+\.\d+)%2C(-?\d+\.\d+)/i,
    /[?&]query=(-?\d+\.\d+),(-?\d+\.\d+)/i,
    /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/i,
    /[?&]center=(-?\d+\.\d+),(-?\d+\.\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);

    if (match) {
      return {
        latitude: Number(match[1]),
        longitude: Number(match[2]),
      };
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

    const allowedHosts = [
      'google.com',
      'www.google.com',
      'maps.google.com',
      'maps.app.goo.gl',
      'goo.gl',
    ];

    const isAllowed = allowedHosts.some(
      (host) =>
        parsedUrl.hostname === host ||
        parsedUrl.hostname.endsWith(`.${host}`)
    );

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Invalid Google Maps URL.' },
        { status: 400 }
      );
    }

    const directCoordinates =
      extractCoordinates(googleMapsUrl);

    if (directCoordinates) {
      return NextResponse.json({
        ...directCoordinates,
        resolvedUrl: googleMapsUrl,
      });
    }

    const response = await fetch(googleMapsUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 Hapësira360 Maps Resolver',
      },
      cache: 'no-store',
    });

    const resolvedUrl = response.url;

    const resolvedCoordinates =
      extractCoordinates(resolvedUrl);

    if (!resolvedCoordinates) {
      return NextResponse.json(
        {
          error:
            'Could not detect coordinates from this Google Maps link. Copy the link directly from the selected location in Google Maps.',
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      ...resolvedCoordinates,
      resolvedUrl,
    });
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