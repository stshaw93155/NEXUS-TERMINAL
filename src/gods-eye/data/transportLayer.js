import * as Cesium from 'cesium';
import { MBTAProvider } from '../../providers/MBTAProvider.js';
import { SimulationProvider } from '../../providers/SimulationProvider.js';

// Generic circular icon for transit
const TRANSIT_DOT_SVG = `data:image/svg+xml;utf8,<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="%2300ffcc" stroke="%23ffffff" stroke-width="2"/></svg>`;

const state = {
  viewer: null,
  enabled: false,
  billboardCollection: null,
  records: new Map(), // string -> TransportEntity
  providers: [],
  selectedRecord: null,
  lastUpdate: null,
  clickHandler: null
};

export default {
  id: 'transport',
  name: 'Global Transit',
  icon: 'directions_transit',
  source: 'Multiple Providers',
  updateInterval: 15000,
  statsRefreshInterval: 1000,

  init(viewer) {
    state.viewer = viewer;
    
    // Initialize providers
    state.providers = [
      new MBTAProvider(),
      new SimulationProvider()
    ];
    
    state.providers.forEach(p => {
      p.onUpdate((entities) => {
        this._handleProviderUpdate(p.id, entities);
      });
    });

    if (!state.clickHandler) {
      state.clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      state.clickHandler.setInputAction((click) => {
        if (!state.enabled) return;
        const picked = viewer.scene.pick(click.position);
        if (Cesium.defined(picked) && picked.id) {
          // Check if picked ID belongs to transport
          if (state.records.has(picked.id)) {
            const record = state.records.get(picked.id);
            // We use dynamic imports to avoid circular dependency
            import('../../state/store.js').then(({ store }) => {
              store.setActiveEntity('transport', record.id, record);
              import('../../utils/audio.js').then(({ playTacticalBlip }) => {
                playTacticalBlip(1000);
              });
            });
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  },

  _handleProviderUpdate(providerId, entities) {
    if (!state.enabled) return;
    
    // Update state.records
    entities.forEach(e => {
      state.records.set(e.id, e);
      this._updateBillboard(e);
    });
    
    // Remove stale entities from this provider
    // This is simple: if it's not in entities array, and starts with providerId, remove it.
    const freshIds = new Set(entities.map(e => e.id));
    for (const [id, e] of state.records.entries()) {
      if (id.startsWith(providerId + '-') && !freshIds.has(id)) {
        this._removeBillboard(id);
        state.records.delete(id);
      }
    }
    
    console.log(`[TransportLayer] Loaded ${entities.length} entities from ${providerId}`);
    
    state.lastUpdate = Date.now();
  },

  _updateBillboard(entity) {
    if (!state.billboardCollection) return;
    
    if (!entity.billboard) {
      entity.billboard = state.billboardCollection.add({
        position: Cesium.Cartesian3.fromDegrees(entity.longitude, entity.latitude, 0),
        image: TRANSIT_DOT_SVG,
        width: 16,
        height: 16,
        scaleByDistance: new Cesium.NearFarScalar(1000, 1.5, 8000000, 0.5),
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      });
      entity.billboard.id = entity.id; // Store ID for picking
    } else {
      entity.billboard.position = Cesium.Cartesian3.fromDegrees(entity.longitude, entity.latitude, 0);
    }
    
    if (entity.heading !== null) {
      // heading in degrees to radians
      entity.billboard.rotation = -Cesium.Math.toRadians(entity.heading);
      entity.billboard.alignedAxis = Cesium.Cartesian3.UNIT_Z; // simple projection
    }
  },
  
  _removeBillboard(id) {
    const record = state.records.get(id);
    if (record && record.billboard && state.billboardCollection) {
      state.billboardCollection.remove(record.billboard);
      record.billboard = null;
    }
  },

  enable(viewer) {
    state.enabled = true;
    state.viewer = viewer;
    
    if (!state.billboardCollection) {
      state.billboardCollection = viewer.scene.primitives.add(new Cesium.BillboardCollection({
        scene: viewer.scene
      }));
    }
    state.billboardCollection.show = true;
    
    state.providers.forEach(p => p.start(this.updateInterval));
    return Promise.resolve(true);
  },

  disable() {
    state.enabled = false;
    state.providers.forEach(p => p.stop());
    if (state.billboardCollection) {
      state.billboardCollection.show = false;
    }
    return Promise.resolve(true);
  },

  update(viewer) {
    return Promise.resolve(true);
  },

  destroy(viewer) {
    this.disable();
    if (state.billboardCollection && viewer) {
      viewer.scene.primitives.remove(state.billboardCollection);
      state.billboardCollection = null;
    }
    if (state.clickHandler) {
      state.clickHandler.destroy();
      state.clickHandler = null;
    }
    state.records.clear();
  },

  hasContact(id) {
    return state.records.has(id);
  },

  getAllPositions(maxCount = 800) {
    const result = [];
    let count = 0;
    for (const [id, record] of state.records.entries()) {
      if (count >= maxCount) break;
      if (record.latitude && record.longitude) {
        result.push({
          id: record.id,
          label: record.label,
          position: Cesium.Cartesian3.fromDegrees(record.longitude, record.latitude, 0),
          latitude: record.latitude,
          longitude: record.longitude,
        });
        count++;
      }
    }
    return result;
  },

  getAnalystRecords(maxCount = 2000) {
    if (!state.enabled) return [];
    const result = [];
    let count = 0;
    for (const [id, record] of state.records.entries()) {
      if (count >= maxCount) break;
      result.push({
        id: record.id,
        type: record.type,
        subtype: record.subtype,
        name: record.label,
        lat: record.latitude,
        lon: record.longitude,
        speed: record.speedMps,
        heading: record.heading,
        metadata: record.metadata
      });
      count++;
    }
    return result;
  },

  selectById(id) {
    const record = state.records.get(id);
    if (!record) return false;
    state.selectedRecord = record;
    return true;
  },

  clearSelection() {
    state.selectedRecord = null;
    return true;
  },

  getSelectedInfo() {
    return state.selectedRecord;
  },

  getDetectableObjects(options = {}) {
    if (!state.enabled || !state.billboardCollection || !state.billboardCollection.show) return [];
    const result = [];
    const maxCount = options.maxCount || 1000;
    let count = 0;
    for (const [id, record] of state.records.entries()) {
      if (count >= maxCount) break;
      if (record.billboard && record.billboard.position) {
        result.push({
          position: record.billboard.position,
          sourceId: record.id,
          id: record.label,
          type: record.type,
          skipLabel: record === state.selectedRecord,
          klass: record.subtype,
          metric: record.speedMps !== null ? `${Math.round(record.speedMps)} m/s` : ''
        });
        count++;
      }
    }
    return result;
  },

  getStats() {
    return {
      count: state.records.size,
      lastUpdate: state.lastUpdate,
      loading: false,
      error: null,
      stale: false,
      status: state.enabled ? 'nominal' : 'idle'
    };
  }
};
