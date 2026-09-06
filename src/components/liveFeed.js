/**
 * NEXUS - Live Intelligence Feed Component
 * Real-time clustered news events and story developments
 */

import { store } from '../state/store.js';
import { playTacticalBlip } from '../utils/audio.js';

export function renderLiveFeed(container) {
  function updateFeed() {
    const stories = store.getFilteredStories();
    const state = store.getState();

    container.innerHTML = `
      <!-- Feed Filter Header Bar -->
      <div class="feed-filter-bar">
        <div class="feed-filter-chips">
          <span class="mono text-dim" style="font-size: 10px; margin-right: 4px;">STREAM:</span>
          ${['ALL', 'BREAKING', 'DEVELOPING', 'ANALYSIS'].map(f => `
            <button class="filter-chip ${state.activeFilter === f ? 'active' : ''}" data-feed-filter="${f}">
              ${f}
            </button>
          `).join('')}
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="mono text-dim" style="font-size: 10px;">
            SHOWING <span class="text-cyan">${stories.length}</span> CLUSTERS
          </span>
          <button id="refresh-feed-btn" class="panel-btn" title="Force Telemetry Sync">
            <span class="material-symbols-outlined" style="font-size: 14px;">sync</span>
          </button>
        </div>
      </div>

      <!-- Story Cards Stream -->
      <div class="story-list" id="story-cards-container">
        ${stories.length === 0 ? `
          <div style="padding: 40px 20px; text-align: center; color: var(--text-dim); font-family: var(--font-mono);">
            <span class="material-symbols-outlined" style="font-size: 32px; opacity: 0.4; margin-bottom: 8px;">search_off</span>
            <div>NO CLUSTERED DEVELOPMENTS MATCHING CURRENT CRITERIA</div>
            <div style="font-size: 11px; margin-top: 6px;">TRY ADJUSTING OPERATIONS REGION OR RESETTING ACTIVE SEARCH QUERY</div>
          </div>
        ` : stories.map(story => {
          const cardClass = story.importance === 'CRITICAL' ? 'critical' :
                            story.status === 'DEVELOPING' ? 'developing' : 'confirmed';

          const importanceBadgeClass = story.importance === 'CRITICAL' ? 'badge-crimson' :
                                       story.importance === 'HIGH' ? 'badge-amber' : 'badge-cyan';

          const statusBadgeClass = story.status === 'DEVELOPING' ? 'badge-amber' : 'badge-emerald';

          return `
            <div class="story-card ${cardClass}" data-story-id="${story.id}">
              <div class="story-meta-top">
                <div class="story-tags">
                  <span class="mono text-cyan" style="font-weight: 700; font-size: 10px;">${story.id}</span>
                  <span class="badge ${importanceBadgeClass}">${story.importance}</span>
                  <span class="badge ${statusBadgeClass}">● ${story.status}</span>
                  <span class="badge badge-muted">${story.category}</span>
                </div>
                <div class="mono text-dim" style="font-size: 10px;">
                  <span>${story.location}</span> • <span>${story.relativeTime}</span>
                </div>
              </div>

              ${story.videoFeedUrl ? `
                <div style="margin: 8px 0; border: 1px solid var(--cyan); border-radius: 4px; overflow: hidden; position: relative;">
                  <div style="position: absolute; top: 4px; left: 4px; background: rgba(220, 20, 60, 0.8); color: white; font-size: 9px; padding: 2px 4px; border-radius: 2px; font-weight: bold; z-index: 10; animation: pulse 2s infinite;">LIVE CCTV</div>
                  <video src="${story.videoFeedUrl}" autoplay loop muted playsinline style="width: 100%; display: block; filter: contrast(1.2) sepia(0.2) hue-rotate(180deg);"></video>
                </div>
              ` : ''}

              <div class="story-headline">${story.title}</div>
              <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.4; margin-bottom: 8px;">
                ${story.headline}
              </div>

              <div class="story-meta-bottom">
                <div class="story-sources-count">
                  <span class="sources-pill">${story.articleCount} ARTICLES</span>
                  <span class="sources-pill" style="border-color: rgba(255,255,255,0.15); color: var(--text-secondary);">${story.sourceCount} SOURCES</span>
                  <span class="mono" style="font-size: 10px; color: var(--emerald);">CONSENSUS: ${story.consensus}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 4px; color: var(--cyan); font-size: 11px;">
                  <span>INVESTIGATE</span>
                  <span class="material-symbols-outlined" style="font-size: 14px;">arrow_forward</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Attach click events on filter chips
    container.querySelectorAll('[data-feed-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        playTacticalBlip(820);
        store.setFilter(btn.getAttribute('data-feed-filter'));
      });
    });

    // Attach click events on story cards
    container.querySelectorAll('[data-story-id]').forEach(card => {
      card.addEventListener('click', () => {
        playTacticalBlip(1000);
        store.selectStory(card.getAttribute('data-story-id'));
      });
    });

    // Ensure videos play when injected via innerHTML
    container.querySelectorAll('video').forEach(vid => {
      vid.play().catch(e => console.warn('Live feed video autoplay prevented:', e));
    });

    // Refresh button
    const refreshBtn = container.querySelector('#refresh-feed-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        playTacticalBlip(1100);
        refreshBtn.classList.add('pulse');
        setTimeout(() => refreshBtn.classList.remove('pulse'), 800);
        updateFeed();
      });
    }
  }

  updateFeed();

  // Re-render when store updates
  store.subscribe(() => {
    updateFeed();
  });
}
