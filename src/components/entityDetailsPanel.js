import { store } from '../state/store.js';
import { formatNumber } from '../utils/formatters.js';

export function renderEntityDetailsPanel(container) {
  let panelContainer = document.getElementById('entity-details-panel');
  if (!panelContainer) {
    panelContainer = document.createElement('div');
    panelContainer.id = 'entity-details-panel';
    // Style as a floating panel over the map
    panelContainer.style.position = 'absolute';
    panelContainer.style.top = '120px';
    panelContainer.style.left = '20px';
    panelContainer.style.width = '300px';
    panelContainer.style.zIndex = '1000';
    panelContainer.style.pointerEvents = 'none'; // Default hidden/inactive
    panelContainer.style.display = 'none';
    
    container.appendChild(panelContainer);
  }

  const renderDetails = (entity) => {
    if (!entity) {
      panelContainer.style.display = 'none';
      return;
    }

    panelContainer.style.display = 'block';
    panelContainer.style.pointerEvents = 'auto'; // allow clicking close

    let content = '';
    const { type, id, data } = entity;

    if (type === 'flight') {
      const callsign = data.callsign || id;
      const speedKts = data.velocity ? (data.velocity * 1.94384).toFixed(0) : '---';
      const altFt = data.baro_altitude ? (data.baro_altitude * 3.28084).toFixed(0) : '---';
      const heading = data.true_track ? data.true_track.toFixed(0) : '---';
      
      content = `
        <div class="panel-header" style="background: rgba(0,0,0,0.8); border: 1px solid var(--cyan); padding: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span class="panel-title" style="color: var(--cyan);">
              <span class="material-symbols-outlined" style="font-size: 14px; margin-right: 4px;">flight</span>
              FLIGHT TRACK
            </span>
            <button id="close-entity-panel" style="background: transparent; border: none; color: var(--text-dim); cursor: pointer;">
              <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
            </button>
          </div>
          <div style="font-size: 16px; font-weight: bold; font-family: var(--font-mono); margin-bottom: 10px; color: #fff;">
            ${callsign}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-family: var(--font-mono); font-size: 10px; color: var(--text-secondary);">
            <div><span style="color: var(--text-dim);">ICAO:</span> ${id}</div>
            <div><span style="color: var(--text-dim);">ORIGIN:</span> ${data.origin_country || 'UNKNOWN'}</div>
            <div><span style="color: var(--text-dim);">SPEED:</span> ${speedKts} KTS</div>
            <div><span style="color: var(--text-dim);">HDG:</span> ${heading}°</div>
            <div><span style="color: var(--text-dim);">ALT:</span> ${altFt} FT</div>
            <div><span style="color: var(--text-dim);">STATUS:</span> ${data.on_ground ? 'GROUND' : 'AIRBORNE'}</div>
          </div>
        </div>
      `;
    } else if (type === 'vessel') {
      const name = data.name || 'UNKNOWN VESSEL';
      const typeStr = data.type || 'Marine Vessel';
      const speedKts = data.speed !== undefined ? data.speed.toFixed(1) : '---';
      const heading = data.heading !== undefined ? data.heading.toFixed(0) : '---';
      const draft = data.draft !== undefined ? data.draft.toFixed(1) : '---';

      content = `
        <div class="panel-header" style="background: rgba(0,0,0,0.8); border: 1px solid var(--cyan); padding: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span class="panel-title" style="color: var(--cyan);">
              <span class="material-symbols-outlined" style="font-size: 14px; margin-right: 4px;">directions_boat</span>
              MARINE AIS
            </span>
            <button id="close-entity-panel" style="background: transparent; border: none; color: var(--text-dim); cursor: pointer;">
              <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
            </button>
          </div>
          <div style="font-size: 14px; font-weight: bold; font-family: var(--font-mono); margin-bottom: 10px; color: #fff;">
            ${name}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-family: var(--font-mono); font-size: 10px; color: var(--text-secondary);">
            <div><span style="color: var(--text-dim);">MMSI:</span> ${id}</div>
            <div><span style="color: var(--text-dim);">TYPE:</span> ${typeStr}</div>
            <div><span style="color: var(--text-dim);">SPEED:</span> ${speedKts} KTS</div>
            <div><span style="color: var(--text-dim);">HDG:</span> ${heading}°</div>
            <div><span style="color: var(--text-dim);">DRAFT:</span> ${draft} m</div>
            <div><span style="color: var(--text-dim);">FLAG:</span> ${data.country || 'UNKNOWN'}</div>
          </div>
        </div>
      `;
    } else if (type === 'cctv') {
      const name = data.name || 'TRAFFIC CAM';
      
      content = `
        <div class="panel-header" style="background: rgba(0,0,0,0.8); border: 1px solid var(--cyan); padding: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span class="panel-title" style="color: var(--cyan);">
              <span class="material-symbols-outlined" style="font-size: 14px; margin-right: 4px;">videocam</span>
              CCTV FEED
            </span>
            <button id="close-entity-panel" style="background: transparent; border: none; color: var(--text-dim); cursor: pointer;">
              <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
            </button>
          </div>
          <div style="font-size: 12px; font-weight: bold; font-family: var(--font-mono); margin-bottom: 10px; color: #fff; line-height: 1.4;">
            ${name}
          </div>
          <div style="font-family: var(--font-mono); font-size: 10px; color: var(--text-dim);">
            ID: ${id}<br/>
            Accessing feed in Analyst Terminal...
          </div>
        </div>
      `;
    } else if (type === 'transport') {
      const name = data.label || data.route || 'TRANSIT ENTITY';
      const transitType = data.type || 'UNKNOWN';
      const status = data.status || 'IN TRANSIT';
      const speed = data.speedMps ? (data.speedMps * 3.6).toFixed(1) + ' km/h' : '---';
      
      // Parse metadata for display
      let metadataHtml = '';
      if (data.metadata) {
        for (const [key, value] of Object.entries(data.metadata)) {
          if (typeof value !== 'object' && value !== null && value !== '') {
            metadataHtml += `<div><span style="color: var(--text-dim);">${key.toUpperCase()}:</span> ${value}</div>`;
          }
        }
      }

      content = `
        <div class="panel-header" style="background: rgba(0,0,0,0.8); border: 1px solid var(--cyan); padding: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span class="panel-title" style="color: var(--cyan);">
              <span class="material-symbols-outlined" style="font-size: 14px; margin-right: 4px;">directions_transit</span>
              GLOBAL TRANSIT
            </span>
            <button id="close-entity-panel" style="background: transparent; border: none; color: var(--text-dim); cursor: pointer;">
              <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
            </button>
          </div>
          <div style="font-size: 14px; font-weight: bold; font-family: var(--font-mono); margin-bottom: 10px; color: #fff; line-height: 1.4;">
            ${name}
          </div>
          <div style="display: grid; grid-template-columns: 1fr; gap: 4px; font-family: var(--font-mono); font-size: 10px; color: var(--text-secondary); margin-bottom: 8px;">
            <div><span style="color: var(--text-dim);">ID:</span> ${id}</div>
            <div><span style="color: var(--text-dim);">TYPE:</span> ${transitType}</div>
            <div><span style="color: var(--text-dim);">STATUS:</span> ${status}</div>
            <div><span style="color: var(--text-dim);">SPEED:</span> ${speed}</div>
          </div>
          ${metadataHtml ? `<div style="display: grid; grid-template-columns: 1fr; gap: 4px; font-family: var(--font-mono); font-size: 9px; color: var(--text-secondary); border-top: 1px solid var(--border-subtle); padding-top: 8px;">${metadataHtml}</div>` : ''}
        </div>
      `;
    }

    panelContainer.innerHTML = content;

    const closeBtn = panelContainer.querySelector('#close-entity-panel');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        store.clearActiveEntity();
      });
    }
  };

  // Initial render
  renderDetails(store.getState().activeEntity);

  // Subscribe to changes
  store.subscribe((state) => {
    renderDetails(state.activeEntity);
  });
}
