/**
 * Vercel Serverless Function: /api/opensky
 * Server-side proxy for the OpenSky Network API to bypass CORS restrictions
 * on the browser. Vite's dev proxy handles local development; this function
 * handles Vercel production deployments.
 */
export default async function handler(req, res) {
  // Allow all origins (our own Vercel domain makes the request)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { lat, lon } = req.query;

  // Build the upstream OpenSky URL, optionally center-bounded
  let upstreamUrl = 'https://opensky-network.org/api/states/all';
  if (lat && lon) {
    const latN = parseFloat(lat);
    const lonN = parseFloat(lon);
    if (Number.isFinite(latN) && Number.isFinite(lonN)) {
      // Bounding box ~30 degrees around the camera center
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

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        'User-Agent': 'NexusTerminal/1.0',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: `OpenSky returned ${upstream.status}`,
      });
    }

    const data = await upstream.json();
    res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');
    return res.status(200).json(data);
  } catch (err) {
    console.error('[api/opensky] fetch error:', err.message);
    return res.status(502).json({ error: 'Failed to fetch from OpenSky Network' });
  }
}
