import { BaseCameraProvider } from './BaseCameraProvider.js';
import { WORLD_CAMERAS } from '../data/world_cameras.js';

/**
 * GlobalCamProvider
 * Adapter for the globally scraped public MJPEG cameras.
 */
export class GlobalCamProvider extends BaseCameraProvider {
  get id() {
    return 'global_cam_provider';
  }

  get name() {
    return 'Global Public Cameras';
  }

  async fetchCameras() {
    // Wrap the static array in a Promise to simulate an async fetch from a real backend.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(WORLD_CAMERAS.map(cam => {
          let secureUrl = cam.mjpeg;
          // Proxy HTTP streams if running on an HTTPS host (like GitHub Pages) to prevent Mixed Content blocks
          if (secureUrl.startsWith('http://') && window.location.protocol === 'https:') {
             secureUrl = 'https://corsproxy.io/?url=' + encodeURIComponent(secureUrl);
          }
          return {
            ...cam,
            url: secureUrl,
            type: 'mjpeg',
          };
        }));
      }, 100);
    });
  }
}
