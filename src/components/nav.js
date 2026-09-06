/**
 * NEXUS - Left Navigation Component
 */

import { store } from '../state/store.js';
import { playTacticalBlip } from '../utils/audio.js';

export function renderNav(container) {
  const state = store.getState();

  const operations = [
    { id: 'GLOBAL', label: 'GLOBAL', icon: 'public', hotkey: 'G', count: 8 },
    { id: 'INDIA', label: 'INDIA', icon: 'hub', hotkey: '1', count: 1 },
    { id: 'US', label: 'US', icon: 'flag', hotkey: '2', count: 2 },
    { id: 'EUROPE', label: 'EUROPE', icon: 'euro_symbol', hotkey: '3', count: 1 },
    { id: 'ASIA', label: 'ASIA', icon: 'travel_explore', hotkey: '4', count: 1 },
    { id: 'MIDDLE EAST', label: 'MIDDLE EAST', icon: 'explore', hotkey: '5', count: 1 },
    { id: 'AFRICA', label: 'AFRICA', icon: 'share_location', hotkey: '6', count: 0 }
  ];

  const intelligence = [
    { id: 'ALL', label: 'ALL FEEDS', icon: 'dataset', hotkey: 'A' },
    { id: 'BREAKING', label: 'BREAKING', icon: 'bolt', hotkey: 'B', count: 2 },
    { id: 'DEVELOPING', label: 'DEVELOPING', icon: 'autorenew', hotkey: 'D', count: 5 },
    { id: 'TRENDING', label: 'TRENDING', icon: 'trending_up', hotkey: 'T' },
    { id: 'ANALYSIS', label: 'ANALYSIS', icon: 'analytics', hotkey: 'N' }
  ];

  const domains = [
    { id: 'ALL', label: 'ALL DOMAINS', icon: 'category' },
    { id: 'TECHNOLOGY', label: 'TECHNOLOGY', icon: 'memory' },
    { id: 'AI', label: 'AI & AGENTS', icon: 'smart_toy' },
    { id: 'DEFENCE', label: 'DEFENCE', icon: 'shield' },
    { id: 'MARKETS', label: 'MARKETS', icon: 'candlestick_chart' },
    { id: 'SCIENCE', label: 'SCIENCE', icon: 'science' },
    { id: 'CLIMATE', label: 'CLIMATE', icon: 'thermostat' },
    { id: 'POLITICS', label: 'POLITICS', icon: 'account_balance' }
  ];

  container.innerHTML = `
    <div class="panel-header">
      <span class="panel-title">
        <span class="material-symbols-outlined" style="font-size: 14px; color: var(--cyan);">tune</span>
        OPERATIONS
      </span>
      <button id="collapse-nav-btn" class="panel-btn" title="Toggle Nav Width">
        <span class="material-symbols-outlined" style="font-size: 14px;">first_page</span>
      </button>
    </div>

    <!-- Operations / Regions -->
    <div class="nav-section">
      <div class="nav-section-title">THEATRES OF OPERATION</div>
      ${operations.map(op => `
        <button class="nav-item ${state.activeRegion === op.id ? 'active' : ''}" data-region="${op.id}">
          <div class="nav-item-left">
            <span class="material-symbols-outlined">${op.icon}</span>
            <span>${op.label}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            ${op.count ? `<span class="nav-item-badge">${op.count}</span>` : ''}
            <span class="kbd-hint" style="font-size: 9px; opacity: 0.7;">${op.hotkey}</span>
          </div>
        </button>
      `).join('')}
    </div>

    <!-- Intelligence Filters -->
    <div class="nav-section">
      <div class="nav-section-title">INTELLIGENCE STREAM</div>
      ${intelligence.map(it => `
        <button class="nav-item ${state.activeFilter === it.id ? 'active' : ''}" data-filter="${it.id}">
          <div class="nav-item-left">
            <span class="material-symbols-outlined">${it.icon}</span>
            <span>${it.label}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            ${it.count ? `<span class="nav-item-badge" style="background: var(--crimson); color: #fff;">${it.count}</span>` : ''}
            <span class="kbd-hint" style="font-size: 9px; opacity: 0.7;">${it.hotkey}</span>
          </div>
        </button>
      `).join('')}
    </div>

    <!-- Domains -->
    <div class="nav-section">
      <div class="nav-section-title">TOPICAL DOMAINS</div>
      ${domains.map(dom => `
        <button class="nav-item ${state.activeDomain === dom.id ? 'active' : ''}" data-domain="${dom.id}">
          <div class="nav-item-left">
            <span class="material-symbols-outlined">${dom.icon}</span>
            <span>${dom.label}</span>
          </div>
        </button>
      `).join('')}
    </div>
  `;

  // Attach Event Listeners
  container.querySelectorAll('[data-region]').forEach(btn => {
    btn.addEventListener('click', () => {
      playTacticalBlip(800);
      store.setRegion(btn.getAttribute('data-region'));
      renderNav(container);
    });
  });

  container.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      playTacticalBlip(850);
      store.setFilter(btn.getAttribute('data-filter'));
      renderNav(container);
    });
  });

  container.querySelectorAll('[data-domain]').forEach(btn => {
    btn.addEventListener('click', () => {
      playTacticalBlip(900);
      store.setDomain(btn.getAttribute('data-domain'));
      renderNav(container);
    });
  });

  const collapseBtn = container.querySelector('#collapse-nav-btn');
  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      playTacticalBlip(700);
      store.toggleNav();
      container.classList.toggle('collapsed', store.getState().navCollapsed);
    });
  }
}
