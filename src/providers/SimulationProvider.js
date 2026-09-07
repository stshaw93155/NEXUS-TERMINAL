import { TransportProvider } from '../transport/TransportProvider.js';
import { TransportEntity } from '../transport/TransportEntity.js';

// A selection of major global cities to scatter simulated transit around
const MAJOR_CITIES = [
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Sao Paulo', lat: -23.5505, lon: -46.6333 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Delhi', lat: 28.7041, lon: 77.1025 },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
  { name: 'Shanghai', lat: 31.2304, lon: 121.4737 },
  { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
  { name: 'Moscow', lat: 55.7558, lon: 37.6173 }
];

/**
 * A demonstration provider that simulates global transit traffic.
 * Since real GTFS-Realtime feeds are highly fragmented per-city and require
 * paid commercial aggregators (like Transitland) for a unified global feed,
 * this provider simulates realistic transit density in major cities to 
 * demonstrate the global architecture.
 */
export class SimulationProvider extends TransportProvider {
  constructor() {
    super('demo-global', 'Global Transit Simulation');
    this.vehicles = [];
    this._initializeVehicles();
  }

  _initializeVehicles() {
    // Generate ~50-200 vehicles per city
    MAJOR_CITIES.forEach((city, cityIdx) => {
      const count = 50 + Math.floor(Math.random() * 150);
      for (let i = 0; i < count; i++) {
        const isRail = Math.random() > 0.6;
        
        // Scatter within ~20km radius
        const latOffset = (Math.random() - 0.5) * 0.4;
        const lonOffset = (Math.random() - 0.5) * 0.4;
        
        this.vehicles.push({
          id: `sim-${cityIdx}-${i}`,
          city: city.name,
          type: isRail ? 'RAIL' : 'ROAD',
          subtype: isRail ? 'SUBWAY' : 'BUS',
          lat: city.lat + latOffset,
          lon: city.lon + lonOffset,
          heading: Math.random() * 360,
          speed: isRail ? 15 + Math.random() * 20 : 5 + Math.random() * 15 // m/s
        });
      }
    });
  }

  async poll() {
    // Simulate vehicle movement
    this.vehicles.forEach(v => {
      // Move slightly based on heading and speed
      const distDeg = (v.speed / 111320); // rough meter to degree conversion
      const rad = v.heading * (Math.PI / 180);
      v.lat += Math.cos(rad) * distDeg;
      v.lon += Math.sin(rad) * distDeg;
      
      // Randomly change heading slightly
      v.heading = (v.heading + (Math.random() - 0.5) * 10) % 360;

      const entityData = {
        id: v.id,
        type: v.type,
        subtype: v.subtype,
        latitude: v.lat,
        longitude: v.lon,
        heading: v.heading,
        speedMps: v.speed,
        label: `${v.city} ${v.subtype} ${v.id.split('-')[2]}`,
        metadata: {
          agency: 'Global Transit Sim',
          status: 'IN_TRANSIT',
          city: v.city
        }
      };

      if (this.entities.has(v.id)) {
        this.entities.get(v.id).update(entityData);
      } else {
        this.entities.set(v.id, new TransportEntity(entityData));
      }
    });

    this.notifyUpdate();
  }
}
