/**
 * NEXUS - Command Palette & Keyboard Shortcuts System
 */

import { store } from '../state/store.js';
import { playTacticalBlip } from '../utils/audio.js';

export function setupCommandPalette(paletteModal, shortcutsModal) {
  const COMMANDS = [
    { id: 'cmd-global', category: 'THEATERS', title: 'Switch Theater: GLOBAL', hint: '/global', action: () => store.setRegion('GLOBAL') },
    { id: 'cmd-india', category: 'THEATERS', title: 'Switch Theater: INDIA', hint: '/india', action: () => store.setRegion('INDIA') },
    { id: 'cmd-us', category: 'THEATERS', title: 'Switch Theater: UNITED STATES', hint: '/us', action: () => store.setRegion('US') },
    { id: 'cmd-europe', category: 'THEATERS', title: 'Switch Theater: EUROPE', hint: '/europe', action: () => store.setRegion('EUROPE') },
    { id: 'cmd-asia', category: 'THEATERS', title: 'Switch Theater: ASIA', hint: '/asia', action: () => store.setRegion('ASIA') },
    { id: 'cmd-mideast', category: 'THEATERS', title: 'Switch Theater: MIDDLE EAST', hint: '/mideast', action: () => store.setRegion('MIDDLE EAST') },

    { id: 'cmd-breaking', category: 'INTELLIGENCE', title: 'Filter: BREAKING / CRITICAL Only', hint: '/breaking', action: () => store.setFilter('BREAKING') },
    { id: 'cmd-developing', category: 'INTELLIGENCE', title: 'Filter: DEVELOPING Developments', hint: '/developing', action: () => store.setFilter('DEVELOPING') },
    { id: 'cmd-analysis', category: 'INTELLIGENCE', title: 'Filter: DEEP ANALYSIS', hint: '/analysis', action: () => store.setFilter('ANALYSIS') },

    { id: 'cmd-tech', category: 'DOMAINS', title: 'Domain: TECHNOLOGY', hint: '/tech', action: () => store.setDomain('TECHNOLOGY') },
    { id: 'cmd-ai', category: 'DOMAINS', title: 'Domain: AI & AUTONOMOUS SYSTEMS', hint: '/ai', action: () => store.setDomain('AI') },
    { id: 'cmd-defence', category: 'DOMAINS', title: 'Domain: DEFENCE & MARITIME', hint: '/defence', action: () => store.setDomain('DEFENCE') },
    { id: 'cmd-markets', category: 'DOMAINS', title: 'Domain: FINANCIAL MARKETS & ENERGY', hint: '/markets', action: () => store.setDomain('MARKETS') },

    { id: 'cmd-audio', category: 'SETTINGS', title: 'Toggle Tactical Audio SFX', hint: 'Audio On/Off', action: () => store.toggleAudio() },
    { id: 'cmd-scanlines', category: 'SETTINGS', title: 'Toggle CRT Scanlines Effect', hint: 'CRT Filter', action: () => store.toggleScanlines() },
    { id: 'cmd-terminal', category: 'TERMINAL', title: 'Focus Gemini Analyst Terminal', hint: 'Ask AI', action: () => document.getElementById('terminal-prompt-input')?.focus() }
  ];

  let selectedIndex = 0;
  let filteredCommands = [...COMMANDS];

  function renderPalette() {
    paletteModal.innerHTML = `
      <div class="command-palette-card tactical-box" id="palette-box">
        <div class="palette-input-wrap">
          <span class="material-symbols-outlined text-cyan" style="font-size: 18px;">terminal</span>
          <input 
            type="text" 
            id="palette-search-input" 
            class="palette-input" 
            placeholder="Type command, operation theater, or story title..."
            autocomplete="off"
            spellcheck="false"
          />
          <span class="kbd-hint">ESC</span>
        </div>

        <div class="palette-results" id="palette-items-list">
          ${renderItemsList()}
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 14px; background: rgba(0,0,0,0.3); border-top: 1px solid var(--border-subtle); font-family: var(--font-mono); font-size: 10px; color: var(--text-dim);">
          <div>Navigate: <span class="text-cyan">↑↓</span> | Select: <span class="text-cyan">ENTER</span></div>
          <div>NEXUS COMMAND DISPATCH</div>
        </div>
      </div>
    `;

    const input = paletteModal.querySelector('#palette-search-input');
    const itemsList = paletteModal.querySelector('#palette-items-list');

    input.focus();

    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        filteredCommands = [...COMMANDS];
      } else {
        filteredCommands = COMMANDS.filter(c => 
          c.title.toLowerCase().includes(q) || 
          c.category.toLowerCase().includes(q) || 
          c.hint.toLowerCase().includes(q)
        );

        // Also match stories
        const matchingStories = store.getState().stories.filter(s => 
          s.title.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
        );
        matchingStories.forEach(s => {
          filteredCommands.push({
            id: `story-${s.id}`,
            category: 'STORIES',
            title: `${s.id}: ${s.title}`,
            hint: s.location,
            action: () => store.selectStory(s.id)
          });
        });
      }

      selectedIndex = 0;
      itemsList.innerHTML = renderItemsList();
      bindItemClicks();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % Math.max(1, filteredCommands.length);
        itemsList.innerHTML = renderItemsList();
        bindItemClicks();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length);
        itemsList.innerHTML = renderItemsList();
        bindItemClicks();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeSelected();
      } else if (e.key === 'Escape') {
        closePalette();
      }
    });

    bindItemClicks();
  }

  function renderItemsList() {
    if (filteredCommands.length === 0) {
      return `
        <div style="padding: 24px; text-align: center; color: var(--text-dim); font-family: var(--font-mono); font-size: 11px;">
          NO MATCHING COMMANDS OR ACTIVE INTELLIGENCE
        </div>
      `;
    }

    return filteredCommands.map((c, i) => `
      <div class="palette-item ${i === selectedIndex ? 'selected' : ''}" data-cmd-index="${i}">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="badge badge-muted" style="font-size: 9px;">${c.category}</span>
          <span style="font-weight: 500;">${c.title}</span>
        </div>
        <span class="mono text-dim" style="font-size: 10px;">${c.hint}</span>
      </div>
    `).join('');
  }

  function bindItemClicks() {
    paletteModal.querySelectorAll('[data-cmd-index]').forEach(el => {
      el.addEventListener('click', () => {
        selectedIndex = parseInt(el.getAttribute('data-cmd-index'), 10);
        executeSelected();
      });
    });
  }

  function executeSelected() {
    const cmd = filteredCommands[selectedIndex];
    if (cmd) {
      playTacticalBlip(1050);
      closePalette();
      cmd.action();
    }
  }

  function openPalette() {
    playTacticalBlip(900);
    paletteModal.classList.add('open');
    filteredCommands = [...COMMANDS];
    selectedIndex = 0;
    renderPalette();
  }

  function closePalette() {
    paletteModal.classList.remove('open');
    paletteModal.innerHTML = '';
  }

  paletteModal.addEventListener('click', (e) => {
    if (e.target === paletteModal) {
      closePalette();
    }
  });

  // Setup Shortcuts Dialog
  function openShortcuts() {
    playTacticalBlip(880);
    shortcutsModal.classList.add('open');
    shortcutsModal.innerHTML = `
      <div class="modal-card tactical-box" style="max-width: 520px;">
        <div class="modal-header">
          <span class="mono text-cyan" style="font-weight: 700;">NEXUS TACTICAL SHORTCUTS REFERENCE</span>
          <button id="close-shortcuts-btn" class="panel-btn">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="modal-body" style="padding: 16px;">
          <table style="width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 12px;">
            <tbody>
              <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 8px 0; color: var(--cyan);"><span class="kbd-hint">/</span> or <span class="kbd-hint">Ctrl+K</span></td><td style="color: var(--text-secondary);">Open Command Palette & Global Search</td></tr>
              <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 8px 0; color: var(--cyan);"><span class="kbd-hint">A</span></td><td style="color: var(--text-secondary);">Focus Gemini Analyst Terminal</td></tr>
              <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 8px 0; color: var(--cyan);"><span class="kbd-hint">G</span></td><td style="color: var(--text-secondary);">Switch to Global Theater</td></tr>
              <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 8px 0; color: var(--cyan);"><span class="kbd-hint">B</span></td><td style="color: var(--text-secondary);">Filter Breaking Incidents</td></tr>
              <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 8px 0; color: var(--cyan);"><span class="kbd-hint">T</span></td><td style="color: var(--text-secondary);">Filter Trending Topics</td></tr>
              <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 8px 0; color: var(--cyan);"><span class="kbd-hint">ESC</span></td><td style="color: var(--text-secondary);">Dismiss Open Modal / Case Workspace</td></tr>
              <tr><td style="padding: 8px 0; color: var(--cyan);"><span class="kbd-hint">?</span></td><td style="color: var(--text-secondary);">Show Shortcuts Cheat Sheet</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    shortcutsModal.querySelector('#close-shortcuts-btn')?.addEventListener('click', () => {
      shortcutsModal.classList.remove('open');
    });

    shortcutsModal.addEventListener('click', (e) => {
      if (e.target === shortcutsModal) {
        shortcutsModal.classList.remove('open');
      }
    });
  }

  // Global Keyboard Listeners
  window.addEventListener('keydown', (e) => {
    // Ignore when focused inside input/textarea unless it's Esc or Ctrl+K
    const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);

    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      openPalette();
      return;
    }

    if (e.key === '/' && !isInput) {
      e.preventDefault();
      openPalette();
      return;
    }

    if (e.key === 'Escape') {
      if (paletteModal.classList.contains('open')) {
        closePalette();
      } else if (shortcutsModal.classList.contains('open')) {
        shortcutsModal.classList.remove('open');
      } else if (store.getState().selectedStoryId) {
        store.closeInvestigation();
      }
      return;
    }

    if (e.key === '?' && !isInput) {
      e.preventDefault();
      openShortcuts();
      return;
    }

    if (!isInput) {
      if (e.key === 'g' || e.key === 'G') {
        store.setRegion('GLOBAL');
        playTacticalBlip(800);
      } else if (e.key === 'b' || e.key === 'B') {
        store.setFilter('BREAKING');
        playTacticalBlip(850);
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        document.getElementById('terminal-prompt-input')?.focus();
        playTacticalBlip(950);
      }
    }
  });

  window.addEventListener('open-command-palette', () => openPalette());
  window.addEventListener('open-shortcuts-help', () => openShortcuts());
}
