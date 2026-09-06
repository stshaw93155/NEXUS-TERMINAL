/**
 * Vercel Edge Function: /api/cam/[id]
 * Streams MJPEG camera feeds from raw HTTP cameras server-side to bypass
 * Mixed Content and CORS restrictions on HTTPS-hosted Vercel deployments.
 *
 * Uses the Edge Runtime for true streaming — serverless (Node.js) functions
 * buffer the entire response before sending, which breaks MJPEG multipart streams.
 * Edge runtime pipes bytes through immediately.
 */

export const config = {
  runtime: 'edge',
};

// Camera registry — single source of truth for cam id → upstream URL mapping
const CAMERAS = {
  'cctv-jp-1': 'http://114.179.127.11:8002/mjpg/video.mjpg',
  'cctv-jp-2': 'http://153.156.20.243:80/mjpg/video.mjpg',
  'cctv-gb-1': 'http://82.71.13.178:8080/mjpg/video.mjpg',
  'cctv-fr-1': 'http://80.15.183.96:81/mjpg/video.mjpg',
  'cctv-fr-2': 'http://82.127.249.27:8000/mjpg/video.mjpg',
  'cctv-fr-3': 'http://80.11.95.43:80/mjpg/video.mjpg',
  'cctv-ru-1': 'http://78.36.19.87:80/mjpg/video.mjpg',
  'cctv-br-1': 'http://143.106.161.110:80/mjpg/video.mjpg',
  'cctv-us-1': 'http://128.146.135.226:80/mjpg/video.mjpg',
  'cctv-us-2': 'http://216.107.197.101:8086/mjpg/video.mjpg',
  'cctv-us-3': 'http://204.93.117.45:80/mjpg/video.mjpg',
  'cctv-us-4': 'http://174.141.163.166:8080/mjpg/video.mjpg',
  'cctv-us-5': 'http://217.180.234.228:80/mjpg/video.mjpg',
  'cctv-us-6': 'http://184.177.43.105:80/mjpg/video.mjpg',
  'cctv-de-1': 'http://37.24.24.185:88/mjpg/video.mjpg',
  'cctv-de-2': 'http://89.1.82.42:80/mjpg/video.mjpg',
  'cctv-es-1': 'http://2.136.124.194:82/mjpg/video.mjpg',
  'cctv-es-2': 'http://2.136.124.194:83/mjpg/video.mjpg',
};

export default async function handler(req) {
  const url = new URL(req.url);
  // Extract camera id from path: /api/cam/cctv-jp-1 → cctv-jp-1
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  const upstreamUrl = CAMERAS[id];
  if (!upstreamUrl) {
    return new Response(JSON.stringify({ error: `Unknown camera: ${id}` }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NexusTerminal/1.0)',
      },
    });

    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: `Camera returned ${upstream.status}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const contentType = upstream.headers.get('content-type') || 'multipart/x-mixed-replace';

    // Pipe the stream through — Edge runtime supports ReadableStream passthrough
    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
