/**
 * NEXUS - Master Header Component
 */

import { store } from '../state/store.js';
import { formatUTCTime } from '../utils/formatters.js';
import { playTacticalBlip } from '../utils/audio.js';

export function renderHeader(container) {
  container.innerHTML = `
    <div class="brand-group">
      <button id="mobile-menu-btn" class="panel-btn" style="display:none;" title="Toggle Navigation">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <div class="brand-badge">
        <span class="material-symbols-outlined" style="font-size: 16px;">radar</span>
      </div>
      <div style="display: flex; align-items: baseline;">
        <span class="brand-title">NEXUS</span>
        <span class="brand-subtitle">GLOBAL INTELLIGENCE TERMINAL</span>
      </div>
    </div>

    <div class="header-status-group">
      <div class="status-pill" title="Telemetry core operational">
        <div class="status-dot emerald pulse"></div>
        <span>SYSTEM ONLINE</span>
      </div>
      <div class="status-pill" title="Live stream ingestion connected">
        <div class="status-dot cyan pulse"></div>
        <span>NEWS STREAM LIVE</span>
      </div>
      <div class="status-pill" title="Gemini 1.5/2.0 API Connected">
        <div class="status-dot pulse" style="background: var(--purple); box-shadow: 0 0 6px var(--purple);"></div>
        <span>GEMINI READY</span>
      </div>
      <div class="status-pill" id="gdelt-status" title="GDELT Ingestion: IDLE">
        <div class="status-dot green pulse" id="gdelt-status-dot"></div>
        <span id="gdelt-status-text">GDELT SYNC</span>
      </div>
      <div id="live-clock" class="header-clock">
        00:00:00 UTC
      </div>
    </div>

    <div class="header-tools">
      <button id="header-search-btn" class="quick-search-btn" title="Open Command Palette (Ctrl+K or /)">
        <span class="material-symbols-outlined" style="font-size: 14px;">search</span>
        <span>Search terminal</span>
        <span class="kbd-hint">/</span>
      </button>

      <button id="toggle-audio-btn" class="panel-btn" title="Toggle Tactical Audio">
        <span class="material-symbols-outlined" id="audio-icon">volume_up</span>
      </button>

      <button id="toggle-scanlines-btn" class="panel-btn" title="Toggle CRT Scanline Filter">
        <span class="material-symbols-outlined">tv</span>
      </button>

      <button id="shortcuts-help-btn" class="panel-btn" title="Keyboard Shortcuts (?)">
        <span class="material-symbols-outlined">keyboard</span>
      </button>
    </div>
  `;

  // Start live UTC clock
  const clockEl = container.querySelector('#live-clock');
  function updateClock() {
    if (clockEl) {
      clockEl.textContent = formatUTCTime();
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Bind Header buttons
  const searchBtn = container.querySelector('#header-search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      playTacticalBlip(980);
      window.dispatchEvent(new CustomEvent('open-command-palette'));
    });
  }

  const audioBtn = container.querySelector('#toggle-audio-btn');
  const audioIcon = container.querySelector('#audio-icon');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      store.toggleAudio();
      const enabled = store.getState().audioEnabled;
      audioIcon.textContent = enabled ? 'volume_up' : 'volume_off';
      if (enabled) playTacticalBlip(1050);
    });
  }

  const scanlinesBtn = container.querySelector('#toggle-scanlines-btn');
  if (scanlinesBtn) {
    scanlinesBtn.addEventListener('click', () => {
      playTacticalBlip(750);
      store.toggleScanlines();
    });
  }

  const helpBtn = container.querySelector('#shortcuts-help-btn');
  if (helpBtn) {
    helpBtn.addEventListener('click', () => {
      playTacticalBlip(880);
      window.dispatchEvent(new CustomEvent('open-shortcuts-help'));
    });
  }

  const mobileMenuBtn = container.querySelector('#mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      playTacticalBlip(600);
      const nav = document.getElementById('nav-panel');
      if (nav) nav.classList.toggle('mobile-open');
    });
  }

  // Bind GDELT Telemetry
  store.subscribe((state) => {
    const gdeltStatus = container.querySelector('#gdelt-status');
    const gdeltDot = container.querySelector('#gdelt-status-dot');
    
    if (gdeltStatus && gdeltDot && state.gdeltStats) {
      const stats = state.gdeltStats;
      gdeltStatus.title = `GDELT Ingestion: ${stats.status} | Last Fetch: ${stats.lastFetch || 'Never'} | Fetched: ${stats.fetched} | New: ${stats.newInserted} | Dups Skipped: ${stats.duplicatesSkipped}`;
      
      gdeltDot.className = 'status-dot pulse'; // reset classes
      if (stats.status === 'ERROR') {
        gdeltDot.classList.add('red');
      } else if (stats.status === 'OK') {
        gdeltDot.classList.add('green');
      } else {
        gdeltDot.classList.add('cyan'); // IDLE
      }
    }
  });
}
