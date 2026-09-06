/**
 * Vercel Edge Function: /api/opensky
 * Server-side proxy for the OpenSky Network API to bypass CORS restrictions.
 * Uses Edge Runtime (V8) which is always ESM-compatible and has no cold-start.
 * Vite's dev proxy handles local development; this Edge function handles Vercel.
 */

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const lat = url.searchParams.get('lat');
  const lon = url.searchParams.get('lon');

  // Build the upstream OpenSky URL, optionally with a bounding box
  let upstreamUrl = 'https://opensky-network.org/api/states/all';
  if (lat && lon) {
    const latN = parseFloat(lat);
    const lonN = parseFloat(lon);
    if (Number.isFinite(latN) && Number.isFinite(lonN)) {
      const box = 15;
      const params = new URLSearchParams({
        lamin: String(Math.max(-90, latN - box)),
        lomin: String(Math.max(-180, lonN - box)),
        lamax: String(Math.min(90, latN + box)),
        lomax: String(Math.min(180, lonN + box)),
      });
      upstreamUrl += `?${params}`;
    }
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        'User-Agent': 'NexusTerminal/1.0',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!upstream.ok) {
      return new Response(
        JSON.stringify({ error: `OpenSky returned ${upstream.status}` }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const data = await upstream.text();

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch from OpenSky Network', detail: err.message }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
