import { defineConfig, loadEnv } from 'vite';
import cesium from 'vite-plugin-cesium';
import fetch from 'node-fetch';

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
      server.middlewares.use('/api/openrouter/chat', async (req, res) => {
        const env = loadEnv(server.config.mode, process.cwd(), '');
        const apiKey = env.VITE_OPENROUTER_API_KEY;
        
        if (!apiKey) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'VITE_OPENROUTER_API_KEY is not set in .env' }));
        }

        // Read request body
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const parsedBody = JSON.parse(body);
            const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'NEXUS Terminal',
              },
              body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet',
                messages: parsedBody.messages,
                tools: parsedBody.tools,
                tool_choice: parsedBody.tools ? 'auto' : 'none'
              }),
            });
            
            if (!r.ok) {
              const text = await r.text();
              res.statusCode = r.status;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'OpenRouter API error', details: text }));
            }

            const data = await r.json();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to fetch OpenRouter response' }));
          }
        });
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
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  }
});
