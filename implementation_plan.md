# Implementation Plan: NEXUS — AI News Intelligence Terminal (Milestone 01)

NEXUS is an AI-native real-time news and intelligence workstation inspired by professional intelligence consoles, OSINT workflows, financial terminals, and the `bilawalsidhu/gods-eye-view` aesthetic. 

Per **Section 45 (Milestone 01: Terminal Shell)** of [prd.md](file:///c:/Users/arya/Desktop/nexus%20terminal/prd.md), the initial phase establishes the complete visual and interaction architecture without premature backend coupling, giving users an operational, high-density, real-time command interface across desktop, laptop, tablet, and mobile.

---

## User Review Required

> [!IMPORTANT]
> **Milestone 01 Scope**: Focuses strictly on the client-side terminal shell, operational UX, mock intelligence telemetry, interactive map, command palette, live feed, investigation workspace, and simulated Gemini analyst responses. Live news APIs and server-side Gemini endpoints will be integrated in Milestones 02 & 03.

> [!NOTE]
> **Visualization Architecture**: In accordance with PRD §33 and §45, Milestone 01 implements a responsive high-performance 2D tactical intelligence canvas/vector map with interactive hot zones, coordinates, and pulsing nodes. This ensures instant load (<1s) and flawless cross-device performance, while structuring the layer to seamlessly mount 3D Cesium/Three.js views in Milestone 04.

---

## Architecture & Design System

### 1. Technology Stack
- **Bundler & Tooling**: Vite 6+ with native ES modules (`type: module`).
- **Styling**: Tailored CSS design system with CSS custom properties, grid layouts, tactical HUD borders, subtle CRT scanlines, and restrained glow effects.
- **Typography**:
  - Headers & UI Labels: `Inter` (clean, high-density sans-serif)
  - Telemetry, Tickers, Timestamps & Terminal: `JetBrains Mono` / `SF Mono`
  - Icons: Material Symbols Outlined
- **Color Palette (Dark Tactical Sci-Fi)**:
  - Background Base: `#08090d` / `#0d1017`
  - Panel Surface: `rgba(13, 16, 23, 0.85)` with hairline borders `rgba(255, 255, 255, 0.08)`
  - Tactical Accents:
    - Primary Cyan/HUD: `#00e5ff` (Signal cyan)
    - Critical / Breaking: `#ff3366` (Pulse crimson)
    - Developing / Warning: `#ffaa00` (Amber)
    - Verified / Stable: `#00ff88` (Phosphor green)
    - Muted Telemetry: `#64748b` / `#94a3b8`

---

## Proposed Changes & File Structure

```
nexus-terminal/
├── index.html                   # Master HTML shell with semantic layout, dialogs, HUD overlay
├── package.json                 # Vite scripts and dependencies
├── vite.config.js               # Dev server configuration
├── public/
│   ├── favicon.svg              # NEXUS tactical beacon icon
│   └── sounds/                  # Subtle tactile audio blips (terminal keypress, alert ping)
├── src/
│   ├── main.js                  # Application orchestrator and state coordinator
│   ├── styles/
│   │   ├── base.css             # CSS reset, design tokens, typography, grid variables
│   │   ├── layout.css           # Grid architecture (Header, Nav, Map, Alerts, Feed, Terminal)
│   │   ├── components.css       # Cards, badges, buttons, tickers, dialogs, drawers
│   │   └── tactical.css         # Scanlines, corner brackets, radar pulses, HUD glows
│   ├── state/
│   │   ├── store.js             # Reactive store (active filters, selection, search, UI modes)
│   │   └── mockData.js          # High-fidelity intelligence dataset (stories, alerts, timelines, sources, entities)
│   ├── components/
│   │   ├── header.js            # Live UTC clock, system statuses, search trigger, settings
│   │   ├── nav.js               # Operations, Intelligence, and Domain collapsible rails
│   │   ├── intelligenceMap.js   # Interactive 2D tactical event map with node clustering and tooltips
│   │   ├── alertsPanel.js       # Critical/High/Medium alert stream and trending velocity meters
│   │   ├── liveFeed.js          # Clustered story cards with developing indicators and source counts
│   │   ├── investigationView.js # Deep-dive Case Workspace modal (Timeline, Sources, Entities, AI Assessment)
│   │   ├── geminiAnalyst.js     # Persistent "Ask Anything" terminal with streaming answers and citations
│   │   └── commandPalette.js   # '/' or 'Ctrl+K' fuzzy navigation and action palette
│   └── utils/
│       ├── audio.js             # Subtle synthesised audio cues (Web Audio API - zero external assets required)
│       └── formatters.js        # Timestamp formatting, coordinate formatting, source tags
```

---

## Key Milestone 01 Features

### 1. Master Header (`header.js`)
- System status pills: `● SYSTEM ONLINE`, `● NEWS STREAM LIVE`, `● GEMINI READY`
- Live UTC clock running down to milliseconds
- Last sync timestamp
- Quick search bar + Command palette trigger hint (`Ctrl+K` or `/`)
- Sound toggle, view layout mode switcher, fullscreen trigger

### 2. Collapsible Operations Navigation (`nav.js`)
- **Operations**: GLOBAL, INDIA, US, EUROPE, ASIA, MIDDLE EAST, AFRICA
- **Intelligence**: BREAKING, DEVELOPING, TRENDING, ANALYSIS, INVESTIGATIONS
- **Domains**: POLITICS, BUSINESS, MARKETS, TECHNOLOGY, AI, SCIENCE, DEFENCE, CLIMATE, CULTURE
- Keyboard hotkeys (`[G]`, `[B]`, `[T]`, etc.) and active story count badges

### 3. Center Intelligence & Event Map (`intelligenceMap.js`)
- Scalable vector tactical world map with interactive pulsing hotspots
- Event category color-coding (Conflicts, Diplomacy, Markets, Technology, Natural Disasters)
- Mouseover telemetry HUD (Latitude/Longitude, Event ID, Status, Source Count)
- Click-to-open story investigation
- Map controls (Reset view, Filter by region, Map/Grid toggle)

### 4. Live Feed & Story Clustering (`liveFeed.js`)
- Deduplicated story clusters (e.g. `DEVELOPMENT // 047: US-CHINA TRADE • 27 ARTICLES • 12 SOURCES`)
- Importance markers (`CRITICAL`, `HIGH`, `INFO`)
- Status pills (`● DEVELOPING`, `● CONFIRMED`, `● UNVERIFIED`)
- Live simulated incoming event ticker (updates smoothly without page reload)

### 5. Alerts & Trending Column (`alertsPanel.js`)
- Prioritized alert stack with color-coded severity badges
- Trending Intelligence topic velocity meters (visual volume bars)
- Source Consensus indicators (`HIGH`, `SPLIT`, `DISPUTED`)

### 6. Case Investigation Workspace (`investigationView.js`)
- Modal/Drawer workspace activated on selecting any story
- Sections:
  - Case Overview (`CASE // 2026-0047`)
  - Chronological Timeline with interactive timestamps
  - Source Intelligence matrix (Reuters, AP, Bloomberg, BBC, etc. with consensus meter)
  - Entity Intelligence (Key people, organizations, nations, and tech)
  - Gemini AI Tactical Assessment (Reported vs. Analysis vs. Uncertainty)
  - What to Watch Next indicators

### 7. Gemini Analyst Terminal (`geminiAnalyst.js`)
- Persistent dock at bottom with collapse/expand and full-screen terminal modes
- CLI prompt: `> Ask anything_`
- Command auto-completion (`/search`, `/ask`, `/timeline`, `/sources`, `/story 047`, etc.)
- Fast-action question chips ("What are the biggest stories right now?", "What happened in India today?", "Give me the timeline", "Which sources disagree?")
- Realistic streaming markdown parser rendering structured answers, inline source citations `[Source: Reuters]`, confidence indicators, and interactive follow-ups

### 8. Command Palette & Shortcuts (`commandPalette.js`)
- Quick launcher via `Ctrl+K` or `/`
- Instant fuzzy search across operations, stories, entities, and terminal commands
- Comprehensive shortcuts cheat sheet (`?`)

### 9. Responsive Layout Design
- **Desktop (1440px+)**: 3-column unified console + live feed + AI terminal dock
- **Laptop (1024px-1439px)**: Collapsible rails, compact typography, auto-hidden secondary telemetry
- **Tablet (768px-1023px)**: Tabbed map/feed views, slide-over navigation
- **Mobile (<768px)**: Stacked tactical interface with bottom action bar, slide-up terminal drawer

---

## Verification Plan

### Automated Build & Lint Verification
1. `npm run build`: Verify Vite production bundle compiles cleanly with 0 syntax or bundling errors.
2. `npm run dev`: Validate dev server starts cleanly on port 5173.

### Interactive Browser Verification
Using the `browser_subagent` tool:
1. Load `http://localhost:5173`
2. Test responsive layout at:
   - 1920x1080 (Desktop Wide)
   - 1366x768 (Laptop)
   - 820x1180 (Tablet)
   - 390x844 (Mobile)
3. Test interaction workflows:
   - Press `/` or `Ctrl+K` to open the Command Palette, search for a topic, and press `Enter`.
   - Click a map event or feed item to open the Case Investigation Workspace.
   - Type a question into the Gemini Analyst terminal (e.g. `What are the biggest stories right now?`) and verify the streaming response, source citations, and timeline rendering.
   - Filter by region (e.g. `INDIA`, `US`, `MIDDLE EAST`) and verify map and feed update dynamically.
   - Press `?` to verify the keyboard shortcut HUD modal.
