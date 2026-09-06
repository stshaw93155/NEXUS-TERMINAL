/**
 * NEXUS - Case Investigation Workspace Modal
 * Detailed intelligence dossier, timeline, source consensus, and entity mapping
 */

import { store } from '../state/store.js';
import { playTacticalBlip } from '../utils/audio.js';

export function renderInvestigationModal(modalContainer) {
  const state = store.getState();
  const story = state.stories.find(s => s.id === state.selectedStoryId);

  if (!story) {
    modalContainer.classList.remove('open');
    modalContainer.innerHTML = '';
    return;
  }

  modalContainer.classList.add('open');
  modalContainer.innerHTML = `
    <div class="modal-card tactical-box" id="case-modal-card">
      
      <!-- Modal Header -->
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="mono text-cyan" style="font-weight: 700; font-size: 13px;">${story.code}</span>
          <span class="badge ${story.status === 'CRITICAL' ? 'badge-crimson' : story.status === 'DEVELOPING' ? 'badge-amber' : 'badge-emerald'}">
            ● ${story.status}
          </span>
          <span class="badge badge-muted">${story.category}</span>
        </div>
        <button id="close-modal-btn" class="panel-btn" title="Close Case Workspace (Esc)">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        
        <!-- Case Overview Banner -->
        <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 6px; line-height: 1.35;">
            ${story.title}
          </h2>
          <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 10px;">
            ${story.summary}
          </p>

          <!-- Metric Pills -->
          <div style="display: flex; flex-wrap: wrap; gap: 8px; font-family: var(--font-mono); font-size: 11px;">
            <div class="status-pill">THEATER: <span class="text-cyan">${story.region} (${story.location})</span></div>
            <div class="status-pill">ARTICLES CLUSTERED: <span class="text-cyan">${story.articleCount}</span></div>
            <div class="status-pill">SOURCES AUDITED: <span class="text-cyan">${story.sourceCount}</span></div>
            <div class="status-pill">CONSENSUS: <span class="text-emerald">${story.consensus}</span></div>
            <div class="status-pill">LAST TELEMETRY: <span class="text-dim">${story.timestamp}</span></div>
          </div>
        </div>

        <!-- 2-Column Intelligence Breakdown -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px;">
          
          <!-- Column A: Timeline of Developments -->
          <div>
            <div class="mono text-cyan" style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-outlined" style="font-size: 14px;">schedule</span>
              CHRONOLOGICAL EVENT TIMELINE
            </div>
            <div class="investigation-timeline">
              ${story.timeline.map(node => `
                <div class="timeline-node">
                  <div class="timeline-dot"></div>
                  <div class="timeline-time">${node.time}</div>
                  <div class="timeline-text">${node.text}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Column B: Sources & Stance Matrix -->
          <div>
            <div class="mono text-cyan" style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-outlined" style="font-size: 14px;">fact_check</span>
              SOURCE INTELLIGENCE & CONSENSUS
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${story.sources.map((src, index) => `
                <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); padding: 8px 10px; border-radius: 3px;">
                  <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11px; margin-bottom: 2px;">
                    <span style="color: var(--cyan); font-weight: 600;">CLASSIFIED SOURCE // ${String(index + 1).padStart(2, '0')}</span>
                    <span class="text-dim">${src.time || 'LIVE'}</span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-secondary);">${src.stance || 'Source verification complete'}</div>
                </div>
              `).join('')}
            </div>

            <!-- Entities Radar -->
            <div style="margin-top: 14px;">
              <div class="mono text-cyan" style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 6px;">
                CONNECTED ENTITIES
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${story.entities.map(e => `
                  <span class="badge badge-muted mono" style="font-size: 10px;">
                    <span class="text-dim">[${e.type}]</span> <span style="color: #fff;">${e.name}</span>
                  </span>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Gemini AI Tactical Assessment Section -->
        <div style="background: rgba(0, 229, 255, 0.04); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 4px; padding: 12px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div class="mono text-cyan" style="font-weight: 700; font-size: 11px; display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-outlined" style="font-size: 14px;">psychology</span>
              GEMINI ANALYST // TACTICAL ASSESSMENT
            </div>
            <button id="ask-gemini-case-btn" class="quick-search-btn" style="background: var(--cyan-dim); border-color: var(--cyan); color: var(--cyan);">
              <span class="material-symbols-outlined" style="font-size: 12px;">chat</span>
              <span>Interrogate Case in Terminal</span>
            </button>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; margin-bottom: 8px;">
            <div>
              <div class="mono text-dim" style="font-size: 10px; font-weight: 600; margin-bottom: 2px;">REPORTED FACTS</div>
              <div style="color: var(--text-primary);">${story.aiAssessment.reported}</div>
            </div>
            <div>
              <div class="mono text-dim" style="font-size: 10px; font-weight: 600; margin-bottom: 2px;">STRATEGIC IMPLICATION</div>
              <div style="color: var(--text-primary);">${story.aiAssessment.analysis}</div>
            </div>
          </div>

          <div>
            <div class="mono text-dim" style="font-size: 10px; font-weight: 600; margin-bottom: 4px;">INDICATORS TO WATCH NEXT</div>
            <ul style="padding-left: 18px; color: var(--text-secondary); font-size: 12px; line-height: 1.4;">
              ${story.aiAssessment.whatToWatch.map(w => `<li>${w}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;

  // Close actions
  const closeBtn = modalContainer.querySelector('#close-modal-btn');
  closeBtn?.addEventListener('click', () => {
    playTacticalBlip(700);
    store.closeInvestigation();
  });

  // Light dismiss on backdrop
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      playTacticalBlip(700);
      store.closeInvestigation();
    }
  });

  // Interrogate in Terminal action
  const askCaseBtn = modalContainer.querySelector('#ask-gemini-case-btn');
  askCaseBtn?.addEventListener('click', () => {
    playTacticalBlip(1100);
    store.closeInvestigation();
    window.dispatchEvent(new CustomEvent('send-to-terminal', {
      detail: { query: `Analyze key risks and source consensus for ${story.title}` }
    }));
  });
}
