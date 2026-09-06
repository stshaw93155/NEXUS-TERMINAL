/**
 * NEXUS - AI News Intelligence Terminal
 * Core Application Orchestrator
 */

import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/tactical.css';

import { store } from './state/store.js';
import { renderHeader } from './components/header.js';
import { renderNav } from './components/nav.js';
import { renderIntelligenceMap } from './components/intelligenceMap.js';
import { renderLiveFeed } from './components/liveFeed.js';
import { renderAlertsPanel } from './components/alertsPanel.js';
import { renderGeminiAnalyst } from './components/geminiAnalyst.js';
import { renderInvestigationModal } from './components/investigationView.js';
import { renderEntityDetailsPanel } from './components/entityDetailsPanel.js';
import { renderCctvMatrixPanel } from './components/cctvMatrixPanel.js';
import { setupCommandPalette } from './components/commandPalette.js';
import { playTacticalBlip } from './utils/audio.js';
import { FeedService } from './services/FeedService.js';

document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.getElementById('header-bar');
  const navContainer = document.getElementById('nav-panel');
  const mapContainer = document.getElementById('map-panel');
  const feedContainer = document.getElementById('feed-panel');
  const alertsContainer = document.getElementById('alerts-panel');
  const terminalContainer = document.getElementById('terminal-panel');
  const cctvMatrixContainer = document.getElementById('cctv-matrix-panel');
  const caseModalContainer = document.getElementById('investigation-modal-backdrop');
  const paletteModalContainer = document.getElementById('command-palette-backdrop');
  const shortcutsModalContainer = document.getElementById('shortcuts-modal-backdrop');

  // Initialize Core Layout Components
  if (headerContainer) renderHeader(headerContainer);
  if (navContainer) renderNav(navContainer);
  if (mapContainer) {
    renderIntelligenceMap(mapContainer);
    renderEntityDetailsPanel(mapContainer);
  }
  if (feedContainer) renderLiveFeed(feedContainer);
  if (alertsContainer) renderAlertsPanel(alertsContainer);
  if (terminalContainer) renderGeminiAnalyst(terminalContainer);
  if (cctvMatrixContainer) renderCctvMatrixPanel(cctvMatrixContainer);

  // Initialize Modals & Global Command Handlers
  if (paletteModalContainer && shortcutsModalContainer) {
    setupCommandPalette(paletteModalContainer, shortcutsModalContainer);
  }

  // Subscribe to Case Workspace and Toast changes
  store.subscribe((state) => {
    if (caseModalContainer) {
      renderInvestigationModal(caseModalContainer);
    }
    
    // Toast Rendering
    if (state.latestToast) {
      if (window._lastToastId !== state.latestToast.id) {
        window._lastToastId = state.latestToast.id;
        const toastContainer = document.getElementById('toast-container');
        if (toastContainer) {
          const toast = document.createElement('div');
          toast.className = `toast-notif ${state.latestToast.level.toLowerCase()}`;
          const color = state.latestToast.level === 'CRITICAL' ? 'var(--crimson)' : 'var(--cyan)';
          toast.innerHTML = `
            <div style="font-family: var(--font-mono); font-weight: bold; font-size: 11px; margin-bottom: 4px; color: ${color};">${state.latestToast.title}</div>
            <div style="font-size: 12px; color: rgba(255, 255, 255, 0.9); line-height: 1.4;">${state.latestToast.message}</div>
          `;
          toastContainer.appendChild(toast);
          if (state.latestToast.level === 'CRITICAL') playAlertChime();
          else playTacticalBlip(1200);
          
          setTimeout(() => toast.remove(), 6000);
        }
      }
    }
  });

  // Start live intelligence feeds
  const feedService = new FeedService();
  feedService.startPolling(60000); // 1 minute intervals

  // Bottom Dock Tab Logic
  const tabAnalyst = document.getElementById('tab-analyst');
  const tabCctv = document.getElementById('tab-cctv');
  const dockExpandBtn = document.getElementById('dock-expand-btn');
  const bottomDock = document.getElementById('bottom-dock');
  const dockExpandIcon = document.getElementById('dock-expand-icon');

  if (tabAnalyst && tabCctv) {
    tabAnalyst.addEventListener('click', () => {
      tabAnalyst.classList.add('active');
      tabCctv.classList.remove('active');
      if (terminalContainer) terminalContainer.style.display = 'flex';
      if (cctvMatrixContainer) cctvMatrixContainer.style.display = 'none';
      if (bottomDock && bottomDock.classList.contains('collapsed')) {
        bottomDock.classList.remove('collapsed');
        if (dockExpandIcon) dockExpandIcon.textContent = 'expand_more';
      }
    });

    tabCctv.addEventListener('click', () => {
      tabCctv.classList.add('active');
      tabAnalyst.classList.remove('active');
      if (cctvMatrixContainer) cctvMatrixContainer.style.display = 'flex';
      if (terminalContainer) terminalContainer.style.display = 'none';
      if (bottomDock && bottomDock.classList.contains('collapsed')) {
        bottomDock.classList.remove('collapsed');
        if (dockExpandIcon) dockExpandIcon.textContent = 'expand_more';
      }
    });
  }

  if (dockExpandBtn && bottomDock) {
    dockExpandBtn.addEventListener('click', () => {
      if (bottomDock.classList.contains('collapsed')) {
        bottomDock.classList.remove('collapsed');
        if (dockExpandIcon) dockExpandIcon.textContent = 'expand_more';
      } else {
        bottomDock.classList.add('collapsed');
        bottomDock.classList.remove('expanded');
        if (dockExpandIcon) dockExpandIcon.textContent = 'expand_less';
      }
    });
  }

  // Mobile Bottom Tab Bar Logic
  const mobileTabBtns = document.querySelectorAll('.mobile-tab-btn');
  mobileTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      store.setMobileTab(tab);
      playTacticalBlip(850);

      mobileTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Toggle active mobile panels
      feedContainer?.classList.toggle('active-tab', tab === 'feed');
      mapContainer?.classList.toggle('active-tab', tab === 'map');
      alertsContainer?.classList.toggle('active-tab', tab === 'alerts');
      
      // On mobile, the 'terminal' tab should show the entire bottom dock
      const dock = document.getElementById('bottom-dock');
      dock?.classList.toggle('active-tab', tab === 'terminal');
    });
  });

  // Initial tab setup on mobile
  if (window.innerWidth < 768) {
    feedContainer?.classList.add('active-tab');
  }

  // Welcome audio beep on first interaction
  const initAudio = () => {
    playTacticalBlip(950);
    window.removeEventListener('click', initAudio);
    window.removeEventListener('keydown', initAudio);
  };
  window.addEventListener('click', initAudio);
  window.addEventListener('keydown', initAudio);

  console.log('%c NEXUS // GLOBAL INTELLIGENCE TERMINAL ONLINE ', 'background: #00e5ff; color: #000; font-weight: bold; padding: 4px;');
});
