/**
 * BaseCameraProvider
 * Defines the standard interface for all public camera network adapters.
 */
export class BaseCameraProvider {
  /**
   * Return a unique identifier for this provider.
   */
  get id() {
    return 'base_provider';
  }

  /**
   * Return the human-readable name of the provider.
   */
  get name() {
    return 'Base Provider';
  }

  /**
   * Return an array of all available cameras from this provider.
   * Format:
   * {
   *   id: string,
   *   lat: number,
   *   lng: number,
   *   city: string,
   *   country: string,
   *   url: string,
   *   type: string (e.g. 'mjpeg', 'image', 'hls'),
   *   ...providerSpecificMetadata
   * }
   */
  async fetchCameras() {
    throw new Error('Not implemented');
  }

  /**
   * Helper function to calculate distance in km between two lat/lng coordinates (Haversine).
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  /**
   * Finds the nearest camera to a given lat/lng.
   */
  async findNearestCamera(lat, lng) {
    const cameras = await this.fetchCameras();
    if (!cameras || cameras.length === 0) return null;

    let nearest = null;
    let minDistance = Infinity;

    for (const cam of cameras) {
      if (cam.lat != null && cam.lng != null) {
        const dist = this.calculateDistance(lat, lng, cam.lat, cam.lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = { ...cam, _distanceKm: dist };
        }
      }
    }
    return nearest;
  }
}
