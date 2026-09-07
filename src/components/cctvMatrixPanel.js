/**
 * NEXUS - CCTV Matrix Panel
 */
import { store } from '../state/store.js';
import { GlobalCamProvider } from '../providers/GlobalCamProvider.js';

const PLACEHOLDER_VIDEO = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4';

export async function renderCctvMatrixPanel(container) {
  // Show loading state
  container.innerHTML = `
    <div style="display: flex; height: 100%; width: 100%; align-items: center; justify-content: center; background: #000; color: var(--cyan);">
      <span class="mono">INITIALIZING GLOBAL CAMERA NETWORK...</span>
    </div>
  `;

  const provider = new GlobalCamProvider();
  const cameras = await provider.fetchCameras();

  container.innerHTML = `
    <div style="display: flex; height: 100%; width: 100%;">
      <!-- Left side: Large Focused Video -->
      <div id="cctv-focus-area" style="flex: 2; border-right: 1px solid var(--border-subtle); position: relative; background: #000; display: flex; flex-direction: column;">
        <div style="padding: 10px; background: rgba(0,0,0,0.8); border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; z-index: 10;">
          <span id="cctv-focus-title" class="mono text-cyan" style="font-weight: 700; font-size: 14px;">SELECT A CAMERA</span>
          <span id="cctv-focus-status" class="mono text-error" style="font-size: 10px; animation: blink 1s infinite;">NO SIGNAL</span>
        </div>
        <div style="flex: 1; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
          <img id="cctv-focus-video" src="" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8; display: none;" />
          <div class="scanlines" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)); background-size: 100% 4px, 6px 100%; z-index: 5;"></div>
        </div>
      </div>
      
      <!-- Right side: Grid of all cameras -->
      <div style="flex: 1; display: flex; flex-direction: column; background: var(--bg-core);">
        <div style="padding: 10px; border-bottom: 1px solid var(--border-subtle);">
          <span class="mono text-dim" style="font-size: 11px;">AVAILABLE LIVE FEEDS (\${cameras.length})</span>
        </div>
        <div id="cctv-grid" style="flex: 1; overflow-y: auto; padding: 10px; display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; align-content: flex-start;">
          ${cameras.map(cam => `
            <div class="cctv-grid-item" data-id="${cam.id}" data-name="${cam.name}" data-url="${cam.url}" style="position: relative; aspect-ratio: 16/9; background: #000; border: 1px solid var(--border-subtle); cursor: pointer; transition: border-color var(--transition-fast); overflow: hidden;">
              <img src="${cam.url}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.5;" onerror="this.style.display='none';" />
              <div class="scanlines" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%); background-size: 100% 4px; z-index: 2;"></div>
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); padding: 4px; font-family: var(--font-mono); font-size: 9px; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; z-index: 3;">
                ${cam.name}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Interaction logic
  const focusTitle = document.getElementById('cctv-focus-title');
  const focusStatus = document.getElementById('cctv-focus-status');
  const focusVideo = document.getElementById('cctv-focus-video');
  const gridItems = document.querySelectorAll('.cctv-grid-item');

  gridItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active state from all
      gridItems.forEach(i => i.style.borderColor = 'var(--border-subtle)');
      
      // Set active
      item.style.borderColor = 'var(--cyan)';
      const camId = item.dataset.id;
      const camName = item.dataset.name;
      const camUrl = item.dataset.url;
      
      // Update focus area
      focusTitle.textContent = `[${camId}] ${camName}`;
      focusStatus.textContent = 'LIVE REC';
      focusStatus.classList.remove('text-error');
      focusStatus.classList.add('text-cyan');
      
      focusVideo.src = camUrl;
      focusVideo.style.display = 'block';
    });
  });

  // Subscribe to store to auto-select if a camera is clicked on the map
  store.subscribe((state) => {
    if (state.activeEntity && state.activeEntity.type === 'camera') {
      const camId = state.activeEntity.id;
      const targetItem = Array.from(gridItems).find(i => i.dataset.id === camId);
      if (targetItem) {
        targetItem.click();
      } else {
        // Fallback if camera isn't in our mock list
        focusTitle.textContent = `[${camId}] Unknown Camera`;
        focusStatus.textContent = 'LIVE REC';
        focusStatus.classList.remove('text-error');
        focusStatus.classList.add('text-cyan');
        focusVideo.src = 'http://174.141.163.166:8080/mjpg/video.mjpg'; // fallback to a working mjpeg
        focusVideo.style.display = 'block';
      }
    }
  });
}
