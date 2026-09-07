export class TransportEntity {
  /**
   * @param {Object} data
   * @param {string} data.id Unique identifier
   * @param {string} data.type Main type: 'RAIL', 'ROAD', 'AIR', 'MARITIME'
   * @param {string} data.subtype Specific type: 'SUBWAY', 'BUS', 'COMMERCIAL', etc.
   * @param {number} data.latitude WGS84
   * @param {number} data.longitude WGS84
   * @param {number|null} data.heading Degrees 0-360
   * @param {number|null} data.speedMps Speed in meters per second
   * @param {string} data.label Display label (e.g. Route name or Callsign)
   * @param {Object} data.metadata Additional arbitrary data (agency, status, destination, etc.)
   */
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.subtype = data.subtype || '';
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.heading = data.heading !== undefined ? data.heading : null;
    this.speedMps = data.speedMps !== undefined ? data.speedMps : null;
    this.label = data.label || data.id;
    this.metadata = data.metadata || {};
    this.lastUpdatedAt = Date.now();
  }

  update(data) {
    if (data.latitude !== undefined) this.latitude = data.latitude;
    if (data.longitude !== undefined) this.longitude = data.longitude;
    if (data.heading !== undefined) this.heading = data.heading;
    if (data.speedMps !== undefined) this.speedMps = data.speedMps;
    if (data.label !== undefined) this.label = data.label;
    if (data.metadata !== undefined) {
      this.metadata = { ...this.metadata, ...data.metadata };
    }
    this.lastUpdatedAt = Date.now();
  }
}
