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
        resolve(WORLD_CAMERAS.map(cam => ({
          ...cam,
          url: cam.mjpeg,
          type: 'mjpeg', // We know from earlier scrape that these are all MJPEG feeds
        })));
      }, 100);
    });
  }
}
