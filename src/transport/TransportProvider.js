export class TransportProvider {
  /**
   * @param {string} id Unique identifier for the provider (e.g., 'mbta-rail')
   * @param {string} name Human-readable name
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.entities = new Map(); // string -> TransportEntity
    this.onUpdateCallback = null;
    this.pollingIntervalId = null;
  }

  /**
   * Set a callback to be notified when entities are updated.
   * @param {Function} callback (entities: TransportEntity[]) => void
   */
  onUpdate(callback) {
    this.onUpdateCallback = callback;
  }

  /**
   * Notify listeners of updates.
   */
  notifyUpdate() {
    if (this.onUpdateCallback) {
      this.onUpdateCallback(Array.from(this.entities.values()));
    }
  }

  /**
   * Start polling for updates.
   * @param {number} intervalMs 
   */
  start(intervalMs = 15000) {
    if (this.pollingIntervalId) return;
    this.poll();
    this.pollingIntervalId = setInterval(() => this.poll(), intervalMs);
  }

  /**
   * Stop polling.
   */
  stop() {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = null;
    }
  }

  /**
   * Implement in subclasses to fetch data and update `this.entities`.
   * Should call `this.notifyUpdate()` when done.
   */
  async poll() {
    throw new Error('Not implemented');
  }
}
