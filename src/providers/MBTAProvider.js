import { TransportProvider } from '../transport/TransportProvider.js';
import { TransportEntity } from '../transport/TransportEntity.js';

export class MBTAProvider extends TransportProvider {
  constructor() {
    super('mbta', 'MBTA (Boston)');
    // Use Vercel edge proxy to bypass CORS
    this.endpoint = '/api/mbta';
  }

  async poll() {
    try {
      const response = await fetch(this.endpoint);
      if (!response.ok) {
        throw new Error(`MBTA API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Parse included data for quick lookup
      const routes = new Map();
      if (data.included) {
        data.included.forEach(inc => {
          if (inc.type === 'route') {
            routes.set(inc.id, inc.attributes);
          }
        });
      }

      data.data.forEach(vehicle => {
        const attr = vehicle.attributes;
        const rel = vehicle.relationships;
        if (!attr || !attr.latitude || !attr.longitude) return;
        
        let type = 'ROAD';
        let subtype = 'BUS';
        let label = vehicle.id;
        let routeName = '';

        // MBTA route types: 0: Light Rail, 1: Heavy Rail, 2: Commuter Rail, 3: Bus, 4: Ferry
        if (rel && rel.route && rel.route.data) {
          const routeId = rel.route.data.id;
          const route = routes.get(routeId);
          if (route) {
            routeName = route.short_name || route.long_name;
            label = `${routeName} (${vehicle.id})`;
            if (route.type === 0 || route.type === 1 || route.type === 2) {
              type = 'RAIL';
              subtype = route.type === 2 ? 'COMMUTER' : (route.type === 1 ? 'SUBWAY' : 'TRAM');
            } else if (route.type === 4) {
              type = 'MARITIME';
              subtype = 'FERRY';
            }
          }
        }

        const id = `mbta-${vehicle.id}`;
        const speedMps = attr.speed !== null ? attr.speed : null;
        const heading = attr.bearing !== null ? attr.bearing : null;

        const entityData = {
          id,
          type,
          subtype,
          latitude: attr.latitude,
          longitude: attr.longitude,
          heading,
          speedMps,
          label,
          metadata: {
            agency: 'MBTA',
            status: attr.current_status,
            route: routeName,
            updatedAt: attr.updated_at
          }
        };

        if (this.entities.has(id)) {
          this.entities.get(id).update(entityData);
        } else {
          this.entities.set(id, new TransportEntity(entityData));
        }
      });
      
      // Remove stale entities (not seen in this poll)
      // Since MBTA returns all active vehicles, anything missing is gone.
      const freshIds = new Set(data.data.map(v => `mbta-${v.id}`));
      for (const id of this.entities.keys()) {
        if (!freshIds.has(id)) {
          this.entities.delete(id);
        }
      }

      this.notifyUpdate();
    } catch (err) {
      console.warn(`[TransportLayer] MBTA poll failed:`, err);
    }
  }
}
