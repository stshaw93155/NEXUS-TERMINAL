/**
 * NEXUS - Gemini Analyst Interactive Terminal Dock
 * Conversational investigation, structured AI telemetry, and command parsing
 */

import { store } from '../state/store.js';
import { playTacticalBlip, playKeystrokeSound } from '../utils/audio.js';
import { formatUTCTime } from '../utils/formatters.js';
import { GlobalCamProvider } from '../providers/GlobalCamProvider.js';
import { forecastingEngine } from '../finance/index.js';

export function renderGeminiAnalyst(container) {
  const state = store.getState();

  const suggestionPrompts = [
    "What are the biggest stories right now?",
    "What happened in India today?",
    "Give me the timeline for US-China talks",
    "Which sources disagree on Strait of Hormuz?",
    "What should I watch next in global markets?",
    "Explain the EU AI agent directive simply"
  ];

  container.innerHTML = `
    <!-- Terminal Header & Control Strip -->
    <div class="terminal-header">
      <div class="terminal-brand">
        <span class="material-symbols-outlined" style="font-size: 16px;">terminal</span>
        <span>GEMINI // SENIOR INTELLIGENCE ANALYST</span>
        <span class="status-dot pulse cyan" style="margin-left: 6px;"></span>
        <span id="analyst-status-tag" class="mono text-dim" style="font-size: 10px;">[READY // PROMPT_IDLE]</span>
      </div>

      <div style="display: flex; align-items: center; gap: 6px;">
        <input type="password" id="openrouter-key-input" placeholder="OpenRouter API Key..." style="background: rgba(0,0,0,0.5); color: var(--cyan); border: 1px solid var(--border-subtle); padding: 4px 6px; font-size: 10px; font-family: var(--font-mono); width: 140px; margin-right: 10px;" />
        <button id="terminal-clear-btn" class="panel-btn" title="Clear Console History">
          <span class="material-symbols-outlined">delete_sweep</span>
        </button>
        <button id="terminal-expand-btn" class="panel-btn" title="Expand Terminal (Max / Restore)">
          <span class="material-symbols-outlined" id="expand-icon">expand_less</span>
        </button>
        <button id="terminal-collapse-btn" class="panel-btn" title="Minimize Terminal Dock">
          <span class="material-symbols-outlined">minimize</span>
        </button>
      </div>
    </div>

    <!-- Suggested Quick Interrogation Chips -->
    <div class="terminal-suggestions">
      <span class="mono text-dim" style="font-size: 10px; margin-right: 4px;">INTERROGATE:</span>
      ${suggestionPrompts.map(p => `
        <button class="suggestion-chip" data-suggestion="${p}">${p}</button>
      `).join('')}
    </div>

    <!-- Output Stream Logs -->
    <div class="terminal-output" id="terminal-messages-container"></div>
    
    <!-- Prompt Command Bar -->
    <div class="terminal-input-bar">
      <span class="terminal-prompt-prefix">&gt;</span>
      <input 
        type="text" 
        id="terminal-prompt-input" 
        class="terminal-input" 
        placeholder="Ask anything or enter command (/search, /timeline, /sources, /help)..."
        autocomplete="off"
        spellcheck="false"
      />
      <button id="terminal-submit-btn" class="terminal-send-btn" title="Dispatch Instruction (Enter)">
        <span class="material-symbols-outlined" style="font-size: 16px;">send</span>
      </button>
    </div>
  `;

  const outputContainer = container.querySelector('#terminal-messages-container');
  const inputEl = container.querySelector('#terminal-prompt-input');
  const submitBtn = container.querySelector('#terminal-submit-btn');
  const statusTag = container.querySelector('#analyst-status-tag');
  const expandBtn = container.querySelector('#terminal-expand-btn');
  const collapseBtn = container.querySelector('#terminal-collapse-btn');
  const clearBtn = container.querySelector('#terminal-clear-btn');
  const apiKeyInput = container.querySelector('#openrouter-key-input');
  
  // Load saved key if available, otherwise use the provided default
  const defaultKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
  const savedKey = localStorage.getItem('nexus_openrouter_key');
  apiKeyInput.value = savedKey || defaultKey;

  apiKeyInput.addEventListener('change', (e) => {
    localStorage.setItem('nexus_openrouter_key', e.target.value);
  });

  // Render conversation messages
  function renderMessages() {
    outputContainer.innerHTML = '';
    const messages = store.getState().terminalMessages;

    messages.forEach(msg => {
      const msgEl = document.createElement('div');
      msgEl.className = `terminal-msg ${msg.role}`;

      if (msg.role === 'user') {
        msgEl.innerHTML = `
          <div class="terminal-msg-header">&gt; OPERATOR // ${msg.timestamp}</div>
          <div style="font-size: 13px; font-weight: 500;">${msg.content}</div>
        `;
      } else {
        const d = msg.data;
        msgEl.innerHTML = `
          <div class="terminal-msg-header">
            <span>GEMINI ANALYST // TELEMETRY REPORT [CONFIDENCE: ${d.confidence || 'HIGH'}]</span>
          </div>
          
          <div style="margin-bottom: 8px; font-size: 13px; line-height: 1.5; color: #fff;">
            ${d.summary}
          </div>

          ${d.keyDevelopments?.length ? `
            <div style="margin-bottom: 8px;">
              <div class="mono text-cyan" style="font-size: 10px; font-weight: 700; margin-bottom: 4px;">KEY DEVELOPMENTS</div>
              <ul style="padding-left: 18px; color: var(--text-secondary); font-size: 12px; line-height: 1.45;">
                ${d.keyDevelopments.map(kd => `<li>${kd}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${d.whyItMatters ? `
            <div style="margin-bottom: 8px; background: rgba(0, 229, 255, 0.04); border-left: 2px solid var(--cyan); padding: 6px 10px;">
              <div class="mono text-cyan" style="font-size: 10px; font-weight: 700; margin-bottom: 2px;">WHY THIS MATTERS</div>
              <div style="color: var(--text-primary); font-size: 12px;">${d.whyItMatters}</div>
            </div>
          ` : ''}

          ${d.timeline?.length ? `
            <div style="margin-bottom: 8px;">
              <div class="mono text-cyan" style="font-size: 10px; font-weight: 700; margin-bottom: 4px;">TIMELINE SNAPSHOT</div>
              <div style="display: flex; flex-direction: column; gap: 4px; padding-left: 6px; font-size: 11px;">
                ${d.timeline.map(t => `
                  <div><span class="text-cyan mono">${t.time}</span> — <span style="color: var(--text-secondary);">${t.text}</span></div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${d.sources?.length ? `
            <div style="border-top: 1px solid var(--border-subtle); padding-top: 6px; margin-top: 6px; display: flex; flex-wrap: wrap; gap: 6px;">
              <span class="mono text-dim" style="font-size: 10px;">GROUNDED SOURCES:</span>
              ${d.sources.map(s => `
                <span class="sources-pill" style="font-size: 10px;">${s.name} (${s.time || '14:00 UTC'})</span>
              `).join('')}
            </div>
          ` : ''}
        `;
      }

      outputContainer.appendChild(msgEl);
    });

    outputContainer.scrollTop = outputContainer.scrollHeight;
  }

  renderMessages();

  // Execute Query / Command
  function handleDispatch(query) {
    if (!query || !query.trim()) return;
    const cleanQuery = query.trim();
    inputEl.value = '';

    // Play tactile sound
    playTacticalBlip(950);

    // Record user command
    store.addTerminalMessage({
      id: `msg-${Date.now()}`,
      role: 'user',
      timestamp: formatUTCTime(),
      content: cleanQuery
    });
    renderMessages();

    // Check for CLI Commands
    if (cleanQuery.startsWith('/')) {
      handleCliCommand(cleanQuery);
      return;
    }

    // Otherwise handle natural language intelligence investigation
    simulateGeminiAnalysis(cleanQuery);
  }

  function handleCliCommand(cmd) {
    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    switch (command) {
      case '/help':
        store.addTerminalMessage({
          id: `msg-${Date.now()}`,
          role: 'gemini',
          data: {
            summary: "NEXUS Command Architecture Reference",
            keyDevelopments: [
              "/global - Reset theater of operations to Global overview",
              "/india, /us, /europe, /asia - Jump to specific regional theaters",
              "/breaking - Filter strictly for Critical / Breaking incidents",
              "/search <term> - Query intelligence clusters for keywords or entities",
              "/timeline - Show consolidated global timeline",
              "/sources - Display source consensus breakdown",
              "/nearest-camera <lat> <lng> - Find global public camera near coords",
              "/clear - Clear terminal display buffer"
            ],
            confidence: "SYSTEM_VALIDATED"
          }
        });
        break;

      case '/global':
        store.setRegion('GLOBAL');
        store.setFilter('ALL');
        respondWithSuccess("Theater set to GLOBAL. Displaying all international streams.");
        break;

      case '/india':
        store.setRegion('INDIA');
        respondWithSuccess("Theater shifted to INDIA. Active focus: New Delhi & Sanand Semiconductor Mission.");
        break;

      case '/us':
        store.setRegion('US');
        respondWithSuccess("Theater shifted to UNITED STATES. Active focus: Washington, Cape Canaveral, and Silicon Valley.");
        break;

      case '/europe':
        store.setRegion('EUROPE');
        respondWithSuccess("Theater shifted to EUROPE. Active focus: Brussels EU AI Act & Geneva Bilateral Talks.");
        break;

      case '/breaking':
        store.setFilter('BREAKING');
        respondWithSuccess("Filter activated: BREAKING / CRITICAL incidents only.");
        break;

      case '/search':
        if (arg) {
          store.setSearchQuery(arg);
          respondWithSuccess(`Executing global entity & keyword search for: "${arg}".`);
        } else {
          respondWithSuccess("Usage: /search <keyword or entity name>");
        }
        break;

      case '/nearest-camera':
        if (arg) {
          respondWithSuccess(`Calculating nearest legitimate public camera feed to coordinate: "${arg}"...`);
          findNearestAndDisplay(arg);
        } else {
          respondWithSuccess("Usage: /nearest-camera <lat, lng> or /nearest-camera <lat> <lng>");
        }
        break;

      case '/clear':
        store.state.terminalMessages = [];
        renderMessages();
        return;

      default:
        simulateGeminiAnalysis(cmd);
        return;
    }
    renderMessages();
  }

  function respondWithSuccess(msg) {
    store.addTerminalMessage({
      id: `msg-${Date.now()}`,
      role: 'gemini',
      data: {
        summary: msg,
        confidence: "SYSTEM_EXECUTED"
      }
    });
  }

  async function simulateGeminiAnalysis(query) {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      store.addTerminalMessage({
        id: `msg-${Date.now()}`,
        role: 'gemini',
        data: {
          summary: "API KEY MISSING. Please enter your OpenRouter API Key in the top right to enable live conversational analysis.",
          confidence: "ERROR"
        }
      });
      renderMessages();
      return;
    }

    statusTag.textContent = "[ANALYZING // CONTACTING_OPENROUTER...]";
    statusTag.classList.add('text-cyan');

    try {
      const state = store.getState();
      // Build context string from current live alerts and news
      let contextStr = "CURRENT LIVE CONTEXT:\n";
      contextStr += "=== ACTIVE ALERTS ===\n" + state.alerts.map(a => `- ${a.message} (${a.details})`).join('\n') + "\n";
      contextStr += "=== LATEST NEWS ===\n" + state.stories.slice(0, 5).map(s => `- ${s.title}`).join('\n') + "\n";
      contextStr += "=== MARKET TRENDS ===\n" + state.trending.map(t => `- ${t.term} ${t.sentiment} ${t.change}`).join('\n') + "\n";

      // Check if user is asking about a stock symbol
      let forecastContext = "";
      const symbolMatch = query.match(/\b([A-Z]{2,5}(?:\.[A-Z]+)?)\b/);
      if (symbolMatch) {
         try {
            const symbol = symbolMatch[1];
            const forecast = await forecastingEngine.runForecastForSymbol(symbol);
            if (forecast) {
               forecastContext = `\n=== QUANTITATIVE FORECAST DATA FOR ${symbol} ===\nDirectional Bias: ${forecast.forecast}\nProbability UP: ${Math.round(forecast.probabilities.up * 100)}%\nProbability FLAT: ${Math.round(forecast.probabilities.flat * 100)}%\nProbability DOWN: ${Math.round(forecast.probabilities.down * 100)}%\nTechnical Evidence:\n- RSI: ${forecast.evidence.rsi}\n- MACD Hist: ${forecast.evidence.macdHistogram}\n- SMA50 Trend: ${forecast.evidence.trendSMA50}\n- SMA20 Distance: ${forecast.evidence.distanceSMA20}\nData Quality: HIGH\nTimestamp: ${forecast.timestamp}\n`;
            }
         } catch (e) {
            // Not a tracked symbol or failed to forecast
         }
      }

      const systemPrompt = `You are NEXUS Market Analyst, an analytical research assistant for a personal market-intelligence system.

Your job is to analyze structured market data and explain probabilistic scenarios for future market movements.
You may analyze individual securities and markets.
You must distinguish analysis from certainty.
You must never claim that a future price movement is guaranteed.
You must not issue personalized investment instructions, execute trades, or tell the user to buy or sell.

When asked about future market direction, analyze the supplied data and state which direction currently has a higher model probability and explain the evidence.
Use probabilistic language such as:
'current evidence favors'
'model currently assigns a higher probability'
'upward directional bias'
'downward directional bias'
'uncertain'
'low confidence'

Always provide supporting and opposing evidence.
Never fabricate current prices, news, indicators, probabilities, earnings, market status, or technical levels.
If required data is unavailable, explicitly state that the data is unavailable.
Do not refuse merely because the question concerns future stock movement.
This is an experimental market-research system.

Include a concise research disclaimer with the analysis at the very end of the summary.

CURRENT LIVE CONTEXT:
${contextStr}
${forecastContext}

Respond directly, concisely, and professionally to the user's query. Format your response strictly as a JSON object with the following schema:
{
  "summary": "Main conversational answer (use markdown if needed). MUST end with the short research disclaimer.",
  "keyDevelopments": ["array of 2-3 key points of evidence/risks", "leave empty if just answering conversationally"],
  "whyItMatters": "a short sentence on impact, or null",
  "confidence": "HIGH, MODERATE, or VERIFIED"
}
Ensure you return ONLY valid JSON and nothing else.`;

      // Build recent chat history
      const recentMsgs = state.terminalMessages.slice(-6).filter(m => m.role === 'user' && m.content !== query);
      const messages = [
        { role: "system", content: systemPrompt },
        ...recentMsgs.map(m => ({ role: "user", content: m.content })),
        { role: "user", content: query }
      ];

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          max_tokens: 1500,
          response_format: { type: "json_object" },
          messages: messages
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API returned ${res.status}: ${errText}`);
      }

      const data = await res.json();
      let content = data.choices[0].message.content;
      // Strip markdown codeblocks if API wrapped it in ```json
      content = content.replace(/^\s*```json\s*/i, '').replace(/\s*```\s*$/, '').trim();

      const answerData = JSON.parse(content);
      
      store.addTerminalMessage({
        id: `msg-${Date.now()}`,
        role: 'gemini',
        data: {
          summary: answerData.summary || "No summary provided.",
          keyDevelopments: answerData.keyDevelopments || [],
          whyItMatters: answerData.whyItMatters || null,
          confidence: answerData.confidence || "COMPUTED"
        }
      });

    } catch (err) {
      console.error(err);
      store.addTerminalMessage({
        id: `msg-${Date.now()}`,
        role: 'gemini',
        data: {
          summary: "COMMUNICATION FAILURE: Unable to reach OpenRouter API. " + err.message,
          confidence: "ERROR"
        }
      });
    }

    statusTag.textContent = "[READY // PROMPT_IDLE]";
    statusTag.classList.remove('text-cyan');
    renderMessages();
  }

  async function findNearestAndDisplay(coordString) {
    statusTag.textContent = "[ANALYZING // FINDING_CAMERA...]";
    statusTag.classList.add('text-cyan');
    
    // basic parse of "lat, lng" or "lat lng"
    const cleaned = coordString.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
    const parts = cleaned.split(' ');
    
    if (parts.length < 2) {
       respondWithSuccess("Could not parse coordinates. Please provide valid lat/lng.");
       statusTag.textContent = "[READY // PROMPT_IDLE]";
       statusTag.classList.remove('text-cyan');
       return;
    }
    
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    
    if (isNaN(lat) || isNaN(lng)) {
       respondWithSuccess("Could not parse coordinates. Please provide valid numbers.");
       statusTag.textContent = "[READY // PROMPT_IDLE]";
       statusTag.classList.remove('text-cyan');
       return;
    }
    
    const provider = new GlobalCamProvider();
    const nearest = await provider.findNearestCamera(lat, lng);
    
    if (!nearest) {
      respondWithSuccess(`No cameras found in global provider database.`);
    } else {
      const distStr = nearest._distanceKm.toFixed(2);
      
      const answerData = {
        summary: `**TARGET ACQUIRED:** Nearest legitimate public camera located at ${distStr} km away.`,
        keyDevelopments: [
          `**City/Region**: ${nearest.city || 'Unknown'}, ${nearest.country || 'Unknown'}`,
          `**Location**: [${nearest.lat.toFixed(4)}, ${nearest.lng.toFixed(4)}]`,
          `**Camera ID**: ${nearest.id}`,
        ],
        whyItMatters: `<div style="margin-top: 8px; border: 1px solid var(--cyan); padding: 4px;"><img src="${nearest.url}" style="max-width: 100%; height: auto; display: block;" onerror="this.src='https://via.placeholder.com/400x225?text=NO+SIGNAL'" /></div>`,
        confidence: "SYSTEM_VALIDATED"
      };

      store.addTerminalMessage({
        id: `msg-${Date.now()}`,
        role: 'gemini',
        data: answerData
      });
      renderMessages();
    }
    
    statusTag.textContent = "[READY // PROMPT_IDLE]";
    statusTag.classList.remove('text-cyan');
  }

  // Keyboard Enter and button dispatch
  inputEl.addEventListener('keydown', (e) => {
    playKeystrokeSound();
    if (e.key === 'Enter') {
      handleDispatch(inputEl.value);
    }
  });

  submitBtn?.addEventListener('click', () => {
    handleDispatch(inputEl.value);
  });

  // Suggestion chips
  container.querySelectorAll('[data-suggestion]').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-suggestion');
      inputEl.value = q;
      handleDispatch(q);
    });
  });

  // Clear Terminal
  clearBtn?.addEventListener('click', () => {
    playTacticalBlip(700);
    store.state.terminalMessages = [];
    renderMessages();
  });

  // Expand / Restore Terminal
  expandBtn?.addEventListener('click', () => {
    playTacticalBlip(800);
    store.toggleTerminalExpand();
    container.classList.toggle('expanded', store.getState().terminalExpanded);
    const expandIcon = container.querySelector('#expand-icon');
    expandIcon.textContent = store.getState().terminalExpanded ? 'expand_more' : 'expand_less';
  });

  // Minimize Terminal
  collapseBtn?.addEventListener('click', () => {
    playTacticalBlip(700);
    store.toggleTerminalCollapse();
    container.classList.toggle('collapsed', store.getState().terminalCollapsed);
  });

  // External event listener (e.g. from Investigation modal)
  window.addEventListener('send-to-terminal', (e) => {
    if (e.detail?.query) {
      if (store.getState().terminalCollapsed) {
        store.toggleTerminalCollapse();
        container.classList.remove('collapsed');
      }
      inputEl.value = e.detail.query;
      handleDispatch(e.detail.query);
      inputEl.focus();
    }
  });
}
