import { createGevActionRunner } from './gevActions.js';

export function initGevVoiceCommands({ viewer, styleManager, dataManager, sceneDirector = null, annotations = null }) {
  if (window.__gevVoiceCommands && typeof window.__gevVoiceCommands.stop === 'function') {
    window.__gevVoiceCommands.stop({ removeUi: true });
  }

  const runner = createGevActionRunner({ viewer, styleManager, dataManager, sceneDirector, annotations });
  const ui = createVoiceControl({ reset: true });
  const controller = new GevOpenRouterController({ runner, ui, viewer });

  controller.buttonHandler = () => {
    if (controller.isActive()) controller.stop();
    else controller.start();
  };
  ui.button.addEventListener('click', controller.buttonHandler);

  window.__gevVoiceCommands = controller;
  return controller;
}

class GevOpenRouterController {
  constructor({ runner, ui, viewer }) {
    this.runner = runner;
    this.ui = ui;
    this.viewer = viewer;
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.status = 'idle';

    this.tools = [
      {
        type: "function",
        function: {
          name: "zoom_to_globe",
          description: "Zoom out to show the entire globe",
          parameters: { type: "object", properties: {} }
        }
      },
      {
        type: "function",
        function: {
          name: "adjust_camera_zoom",
          description: "Adjust the camera zoom level",
          parameters: {
            type: "object",
            properties: {
              direction: { type: "string", enum: ["in", "out"] },
              amount: { type: "string", enum: ["little", "medium", "lot"] }
            },
            required: ["direction"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "set_layer_visibility",
          description: "Enable or disable a specific map layer",
          parameters: {
            type: "object",
            properties: {
              layerId: { type: "string", description: "e.g., 'flights', 'ships', 'military', 'weather', 'fires'" },
              enabled: { type: "boolean" }
            },
            required: ["layerId", "enabled"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "fly_to_location",
          description: "Fly the camera to a specific location query",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string" }
            },
            required: ["query"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "clear_annotations",
          description: "Clear any drawings, markers, or annotations on the map",
          parameters: { type: "object", properties: {} }
        }
      }
    ];

    this.messages = [
      {
        role: "system",
        content: "You are the Nexus God's Eye Voice Agent, an advanced satellite mapping assistant. You can control the map, toggle layers (flights, ships, weather, etc.), and answer questions. Keep answers concise."
      }
    ];
  }

  isActive() {
    return this.isListening;
  }

  setStatus(status, detail) {
    this.status = status;
    this.ui.root.dataset.status = status;
    this.ui.status.textContent = status.toUpperCase();
    if (detail) this.ui.detail.textContent = detail;
  }

  setSpeaker(speaker) {
    this.ui.root.dataset.speaker = speaker;
  }

  async start() {
    if (this.isListening) return;

    if (!('webkitSpeechRecognition' in window)) {
      this.setStatus('error', 'Speech recognition not supported in this browser.');
      return;
    }

    this.recognition = new window.webkitSpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.setStatus('listening', 'Speak now...');
      this.setSpeaker('user');
    };

    this.recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      this.setStatus('processing', 'Thinking...');
      this.setSpeaker('idle');
      this.messages.push({ role: 'user', content: transcript });
      await this.processQuery(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      this.setStatus('error', `Error: ${event.error}`);
      this.stop();
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        // Automatically restart if we were still supposed to be listening (but maybe not if we're processing)
        // Let's just require click to speak again for now to keep it simple and reliable.
        this.stop();
      }
    };

    this.recognition.start();
  }

  stop({ removeUi = false } = {}) {
    this.isListening = false;
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    this.synthesis.cancel();
    
    if (removeUi && this.ui.root) {
      this.ui.root.remove();
    } else {
      this.setStatus('idle', 'Voice standby');
      this.setSpeaker('idle');
    }
  }

  async processQuery(text) {
    try {
      const response = await fetch('/api/openrouter/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: this.messages,
          tools: this.tools
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const message = data.choices[0].message;
      this.messages.push(message);

      if (message.tool_calls && message.tool_calls.length > 0) {
        for (const toolCall of message.tool_calls) {
          if (toolCall.type === 'function') {
            const name = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments || '{}');
            console.log('[Voice Agent] Executing tool:', name, args);
            try {
              await this.runner(name, args);
            } catch (err) {
              console.error('Tool execution error', err);
            }
          }
        }
        
        // After tools, we might need a second turn to summarize, but let's just 
        // speak the tool completion if there's no text.
        if (!message.content) {
          this.speak("Action completed.");
          return;
        }
      }

      if (message.content) {
        this.speak(message.content);
      }
    } catch (error) {
      console.error('Error calling OpenRouter proxy:', error);
      this.setStatus('error', 'Failed to reach AI');
      this.speak("I'm sorry, I couldn't process that request.");
    }
  }

  speak(text) {
    this.setStatus('speaking', text);
    this.setSpeaker('ai');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      this.setStatus('idle', 'Voice standby');
      this.setSpeaker('idle');
      this.stop(); // auto stop after speaking to wait for next click
    };
    this.synthesis.speak(utterance);
  }
}

function createVoiceControl({ reset = false } = {}) {
  let root = document.getElementById('gev-voice-control');
  if (root && reset) {
    root.remove();
    root = null;
  }
  if (!root) {
    root = document.createElement('div');
    root.id = 'gev-voice-control';
    root.dataset.status = 'idle';
    root.dataset.speaker = 'idle';
    root.innerHTML = `
      <div class="gev-voice-heading">
        <div class="gev-voice-kicker">AI AGENT</div>
        <div id="gev-voice-status">OFF</div>
        <div class="gev-voice-cost" style="display: none;"></div>
      </div>
      <button id="gev-voice-button" type="button" aria-label="Voice control">
        <span class="gev-mic-orbit"><span class="material-symbols-outlined">mic</span></span>
        <span class="gev-mic-label">ON/OFF</span>
      </button>
      <div class="gev-voice-visualizer" aria-hidden="true">
        \${Array.from({ length: 15 }, (_, index) => \`<span style="--bar:\${index}"></span>\`).join('')}
      </div>
      <div class="gev-voice-readout">
        <div id="gev-voice-detail">VOICE STANDBY</div>
      </div>
      <div id="gev-voice-help" class="gev-voice-help-tray" role="tooltip">
        <span class="gev-voice-help-detail">Click mic to toggle voice</span>
      </div>
    `;
    const commandDock = document.getElementById('command-dock');
    if (commandDock) {
      const locationBar = document.getElementById('location-bar');
      const controlPanel = document.getElementById('control-panel');
      commandDock.appendChild(root);
      if (locationBar) commandDock.insertBefore(locationBar, root);
      if (controlPanel) commandDock.appendChild(controlPanel);
    } else {
      document.body.appendChild(root);
    }
  }
  return {
    root,
    button: root.querySelector('#gev-voice-button'),
    status: root.querySelector('#gev-voice-status'),
    detail: root.querySelector('#gev-voice-detail'),
  };
}
