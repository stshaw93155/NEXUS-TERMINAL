/**
 * NEXUS - Alerts & Trending Intelligence Column
 */

import { store } from '../state/store.js';
import { playTacticalBlip, playAlertChime } from '../utils/audio.js';

export function renderAlertsPanel(container) {
  const { alerts, trending } = store.getState();

  container.innerHTML = `
    <!-- Data Layers Panel -->
    <div class="panel-header" style="border-bottom: 1px solid var(--border-subtle); margin-bottom: 12px; padding-bottom: 8px;">
      <span class="panel-title">
        <span class="material-symbols-outlined" style="font-size: 14px; color: var(--cyan);">layers</span>
        GODS EYE VIEW LAYERS
      </span>
    </div>
    
    <div class="layers-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
      <button class="layer-toggle-btn panel-btn" data-layer-id="flights" style="justify-content: flex-start; padding: 6px 10px; font-size: 10px;">
        <span class="material-symbols-outlined" style="font-size: 14px; margin-right: 6px;">flight</span>
        LIVE FLIGHTS
      </button>
      <button class="layer-toggle-btn panel-btn" data-layer-id="ais-live-vessels" style="justify-content: flex-start; padding: 6px 10px; font-size: 10px;">
        <span class="material-symbols-outlined" style="font-size: 14px; margin-right: 6px;">directions_boat</span>
        MARINE AIS
      </button>
      <button class="layer-toggle-btn panel-btn" data-layer-id="traffic" style="justify-content: flex-start; padding: 6px 10px; font-size: 10px;">
        <span class="material-symbols-outlined" style="font-size: 14px; margin-right: 6px;">traffic</span>
        TRAFFIC CAMS
      </button>
      <button class="layer-toggle-btn panel-btn" data-layer-id="cctv" style="justify-content: flex-start; padding: 6px 10px; font-size: 10px;">
        <span class="material-symbols-outlined" style="font-size: 14px; margin-right: 6px;">videocam</span>
        CCTV CAMS
      </button>
      <button class="layer-toggle-btn panel-btn" data-layer-id="transport" style="justify-content: flex-start; padding: 6px 10px; font-size: 10px;">
        <span class="material-symbols-outlined" style="font-size: 14px; margin-right: 6px;">directions_transit</span>
        GLOBAL TRANSIT
      </button>
    </div>

    <!-- Alerts Header -->
    <div class="panel-header">
      <span class="panel-title">
        <span class="material-symbols-outlined" style="font-size: 14px; color: var(--crimson);">warning</span>
        ALERTS // THREAT DISPATCH
      </span>
      <span class="badge badge-crimson" style="font-size: 9px;">${alerts.length} ACTIVE</span>
    </div>

    <!-- Prioritized Alert Stream -->
    <div class="alerts-list">
      ${alerts.map(al => {
        const severityClass = al.level === 'CRITICAL' ? 'critical' :
                              al.level === 'HIGH' ? 'high' : '';
        const badgeClass = al.level === 'CRITICAL' ? 'badge-crimson' :
                           al.level === 'HIGH' ? 'badge-amber' : 'badge-muted';

        return `
          <div class="alert-item ${severityClass}" data-alert-story="${al.storyId || ''}">
            <div class="alert-header">
              <span class="badge ${badgeClass}">${al.level}</span>
              <span class="mono text-dim">${al.timestamp}</span>
            </div>
            <div class="alert-headline">${al.headline}</div>
            <div class="alert-footer">
              <span class="mono text-cyan" style="font-size: 9px;">THEATER: ${al.region}</span>
              <span class="mono text-dim" style="font-size: 9px;">${al.relativeTime}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Trending Intelligence Velocity Section -->
    <div class="trending-section">
      <div class="panel-header" style="padding: 0 0 8px 0; background: none; border-bottom: 1px solid var(--border-subtle); margin-bottom: 12px;">
        <span class="panel-title" style="font-size: 11px;">
          <span class="material-symbols-outlined" style="font-size: 14px; color: var(--cyan);">show_chart</span>
          TRENDING VELOCITY
        </span>
        <span class="mono text-dim" style="font-size: 10px;">TOPICS</span>
      </div>

      <div class="trending-list">
        ${trending.map(item => `
          <div class="trending-item" data-trending-topic="${item.topic}">
            <div class="trending-meta">
              <span class="mono">
                <span class="trending-rank">${item.rank}</span>
                <span style="color: var(--text-primary); margin-left: 6px; font-weight: 500;">${item.topic}</span>
              </span>
              <span class="mono text-cyan" style="font-size: 10px;">${item.count} ARTS</span>
            </div>
            <div class="trending-bar-track">
              <div class="trending-bar-fill" style="width: ${item.velocity}%;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Source Consensus Gauge -->
    <div style="padding: 12px 10px; border-top: 1px solid var(--border-subtle); background: rgba(0,0,0,0.2);">
      <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 10px; margin-bottom: 6px;">
        <span class="text-dim">GLOBAL SOURCE CONSENSUS</span>
        <span class="text-emerald" style="font-weight: 700;">88.4% HIGH</span>
      </div>
      <div style="display: flex; height: 4px; border-radius: 2px; overflow: hidden; background: rgba(255,255,255,0.08);">
        <div style="width: 76%; background: var(--emerald);" title="Confirmed (76%)"></div>
        <div style="width: 16%; background: var(--amber);" title="Developing (16%)"></div>
        <div style="width: 8%; background: var(--crimson);" title="Disputed (8%)"></div>
      </div>
      <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; color: var(--text-dim); margin-top: 4px;">
        <span>CONFIRMED: 76%</span>
        <span>DEVELOPING: 16%</span>
        <span>DISPUTED: 8%</span>
      </div>
    </div>
  `;

  // Attach Alert click
  container.querySelectorAll('[data-alert-story]').forEach(item => {
    item.addEventListener('click', () => {
      const storyId = item.getAttribute('data-alert-story');
      if (storyId) {
        playAlertChime();
        store.selectStory(storyId);
      }
    });
  });

  // Attach Trending Topic click (filters feed and searches)
  container.querySelectorAll('[data-trending-topic]').forEach(item => {
    item.addEventListener('click', () => {
      playTacticalBlip(920);
      const topic = item.getAttribute('data-trending-topic');
      store.setSearchQuery(topic.split(' ')[0]);
    });
  });

  // Layer toggles - Bind once layerManager is available
  let boundLayerManager = false;
  
  const bindLayerToggles = () => {
    const layerManager = store.getState().layerManager;
    if (layerManager && !boundLayerManager) {
      boundLayerManager = true;
      
      const updateButtons = () => {
        container.querySelectorAll('.layer-toggle-btn').forEach(btn => {
          const id = btn.getAttribute('data-layer-id');
          const entry = layerManager.layers.get(id);
          if (entry && entry.enabled) {
            btn.style.background = 'rgba(0, 229, 255, 0.15)';
            btn.style.borderColor = 'var(--cyan)';
            btn.style.color = 'var(--cyan)';
            btn.classList.add('layer-active');
          } else {
            btn.style.background = 'rgba(255, 255, 255, 0.03)';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            btn.style.color = 'var(--text-dim)';
            btn.classList.remove('layer-active');
          }
        });
      };
      
      // Initial button state
      updateButtons();
      
      // Subscribe to layer manager changes to keep buttons in sync
      layerManager.subscribe(() => {
        updateButtons();
      });

      container.querySelectorAll('.layer-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          playTacticalBlip(800);
          const id = btn.getAttribute('data-layer-id');
          if (layerManager.layers.has(id)) {
            layerManager.toggle(id);
          }
        });
      });
    }
  };

  // Try binding immediately in case it's already available
  bindLayerToggles();
  
  // Otherwise wait for store updates
  store.subscribe(() => {
    bindLayerToggles();
  });
}
