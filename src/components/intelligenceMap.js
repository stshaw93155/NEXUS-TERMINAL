/**
 * NEXUS - Global Intelligence Event Map
 * Tactical 3D Cesium Geospatial Console
 */

import { store } from '../state/store.js';
import { formatCoordinates } from '../utils/formatters.js';
import { playTacticalBlip } from '../utils/audio.js';
import * as Cesium from 'cesium';

// Gods Eye View imports
import { DataLayerManager } from '../gods-eye/data/manager.js';
import { installRenderGovernor } from '../gods-eye/renderGovernor.js';
import flightsModule from '../gods-eye/data/flights.js';
import aisLiveVesselsModule from '../gods-eye/data/aisLiveVessels.js';
import cctvModule from '../gods-eye/data/cctv.js';
import trafficModule from '../gods-eye/data/traffic.js';
import transportLayer from '../gods-eye/data/transportLayer.js';
import { initGevVoiceCommands } from '../gods-eye/voice/gevOpenRouter.js';

export function renderIntelligenceMap(container) {
  container.innerHTML = `
    <div class="panel-header" style="background: rgba(13, 17, 26, 0.85); z-index: 10;">
      <span class="panel-title">
        <span class="material-symbols-outlined" style="font-size: 14px; color: var(--cyan);">language</span>
        GEOSPATIAL INTELLIGENCE CONSOLE
      </span>
      <div class="panel-actions">
        <span id="map-coords-readout" class="hud-telemetry" style="margin-right: 10px;">
          LAT: <span class="val">28.61°N</span> | LNG: <span class="val">77.20°E</span>
        </span>
        <button id="map-zoom-in" class="panel-btn" title="Zoom In">
          <span class="material-symbols-outlined">add</span>
        </button>
        <button id="map-zoom-out" class="panel-btn" title="Zoom Out">
          <span class="material-symbols-outlined">remove</span>
        </button>
        <button id="map-reset" class="panel-btn" title="Reset Theater Center">
          <span class="material-symbols-outlined">restart_alt</span>
        </button>
      </div>
    </div>

    <!-- Interactive Tactical Map Stage -->
    <div id="map-stage" style="position: relative; flex: 1; width: 100%; height: 100%; overflow: hidden;">
      <div id="cesiumContainer" style="width: 100%; height: 100%;"></div>
    </div>
  `;

  const coordsReadout = container.querySelector('#map-coords-readout');

  // Initialize Cesium Viewer
  const viewer = new Cesium.Viewer(container.querySelector('#cesiumContainer'), {
    timeline: false,
    animation: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    vrButton: false,
    selectionIndicator: false,
    infoBox: false,
    msaaSamples: 4,
    contextOptions: {
      webgl: {
        preserveDrawingBuffer: true,
      },
    },
  });

  // Remove default credit container if it's obtrusive, or restyle it
  viewer.scene.globe.enableLighting = true;
  viewer.scene.skyAtmosphere.show = true;
  viewer.scene.skyAtmosphere.atmosphereLightIntensity = 18;
  viewer.scene.skyAtmosphere.saturationShift = -0.12;
  viewer.scene.skyAtmosphere.brightnessShift = -0.08;
  viewer.targetFrameRate = 60;

  // Initialize Gods Eye View Data Layer Manager
  const layerManager = new DataLayerManager(viewer);
  layerManager.register(flightsModule);
  layerManager.register(aisLiveVesselsModule);
  layerManager.register(cctvModule);
  layerManager.register(trafficModule);
  layerManager.register(transportLayer);

  layerManager.finalizeRegistrations([
    { id: 'flights', disposition: 'enabled+options' },
    { id: 'ais-live-vessels', disposition: 'enabled+options' },
    { id: 'cctv', disposition: 'enabled+options' },
    { id: 'traffic', disposition: 'enabled+options' },
    { id: 'transport', disposition: 'enabled+options' }
  ]);

  // Install the Render Governor to handle continuous vs idle rendering for the layers
  installRenderGovernor(viewer);

  // Initialize Voice AI Agent
  try {
    window.__gevVoiceCommands = initGevVoiceCommands({ 
      viewer,
      styleManager: {},
      dataManager: layerManager 
    });
  } catch (err) {
    console.error('Failed to init GEV Voice Commands:', err);
  }

  store.subscribe((state, prev) => {
    // If the map view wasn't active but now is, we might need to trigger a resize/render
    if (state.activeView === 'map' && prev.activeView !== 'map') {
      setTimeout(() => {
        if (viewer) {
          viewer.resize();
        }
      }, 100);
    }
  });
  
  // Attach to store so UI can toggle layers
  store.setLayerManager(layerManager);

  // Add event markers based on store
  const markers = new Map();

  function updateHotspots() {
    const stories = store.getFilteredStories();

    // Remove old entities that are not in the current stories list
    const storyIds = new Set(stories.map(s => s.id));
    for (const [id, entity] of markers.entries()) {
      if (!storyIds.has(id)) {
        viewer.entities.remove(entity);
        markers.delete(id);
      }
    }

    stories.forEach(story => {
      const [lat, lng] = story.coordinates;
      const color = story.importance === 'CRITICAL' ? Cesium.Color.RED : 
                    story.status === 'DEVELOPING' ? Cesium.Color.ORANGE : Cesium.Color.CYAN;

      if (!markers.has(story.id)) {
        const entity = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(lng, lat),
          point: {
            pixelSize: 10,
            color: color,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
          },
          label: {
            text: story.title,
            font: '12px monospace',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -20),
          }
        });
        markers.set(story.id, entity);
      }
    });
  }

  // Update coords readout based on camera
  viewer.camera.changed.addEventListener(() => {
    const cartographic = viewer.camera.positionCartographic;
    const lat = Cesium.Math.toDegrees(cartographic.latitude);
    const lng = Cesium.Math.toDegrees(cartographic.longitude);
    coordsReadout.innerHTML = `LAT: <span class="val">${formatCoordinates(lat, lng)}</span>`;
  });

  // Controls
  container.querySelector('#map-zoom-in')?.addEventListener('click', () => {
    playTacticalBlip(900);
    viewer.camera.zoomIn(2000000);
  });

  container.querySelector('#map-zoom-out')?.addEventListener('click', () => {
    playTacticalBlip(750);
    viewer.camera.zoomOut(2000000);
  });

  container.querySelector('#map-reset')?.addEventListener('click', () => {
    playTacticalBlip(800);
    viewer.camera.flyHome(1);
  });

  // Selection Handler
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (click) {
    const pickedObject = viewer.scene.pick(click.position);
    if (Cesium.defined(pickedObject) && pickedObject.id) {
      const entity = pickedObject.id;
      // find story id from the marker
      for (const [id, marker] of markers.entries()) {
        if (marker === entity) {
          playTacticalBlip(1000);
          store.selectStory(id);
          break;
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  store.subscribe(() => {
    updateHotspots();

    const state = store.getState();
    if (state.selectedStoryId) {
      const entity = markers.get(state.selectedStoryId);
      if (entity) {
        viewer.flyTo(entity, {
          duration: 1.5,
          offset: new Cesium.HeadingPitchRange(
            Cesium.Math.toRadians(0),
            Cesium.Math.toRadians(-45),
            20000
          )
        });
      }
    }
  });
  updateHotspots();
}
