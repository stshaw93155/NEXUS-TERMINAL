import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';

function apiMocks() {
  return {
    name: 'api-mocks',
    configureServer(server) {
      server.middlewares.use('/api/cctv/sources', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          sources: [
            { id: "cam1", city: "Austin", lat: 30.2672, lon: -97.7431, headingDeg: 45, fovDeg: 90, type: "video" },
            { id: "cam2", city: "Austin", lat: 30.2700, lon: -97.7400, headingDeg: 180, fovDeg: 90, type: "video" }
          ]
        }));
      });
      server.middlewares.use('/api/cctv/health', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ statuses: {} }));
      });
      server.middlewares.use('/api/tomtom/status', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ enabled: false }));
      });
      server.middlewares.use('/api/ais-live', (req, res, next) => {
        if (req.url && req.url.includes('/track')) {
          return next();
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          status: 'connected',
          rows: [
            { mmsi: "123456789", name: "Mock Ship Alpha", lat: 29.3, lon: -94.8, speedKts: 10, courseDeg: 45 },
            { mmsi: "987654321", name: "Mock Cargo Beta", lat: 29.4, lon: -94.7, speedKts: 12, courseDeg: 90 }
          ]
        }));
      });
    }
  };
}

export default defineConfig({
  plugins: [cesium(), apiMocks()],
  server: {
    port: 5173,
    host: true,
    open: false,
    proxy: {
      '/api/opensky': {
        target: 'https://opensky-network.org',
        changeOrigin: true,
        rewrite: () => '/api/states/all'
      }
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
});
