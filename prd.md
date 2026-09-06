# NEXUS --- AI News Intelligence Terminal

## Product Requirements Document (PRD)

**Version:** 1.0\
**Status:** Build Specification\
**Working Name:** NEXUS\
**Product:** AI-native real-time news and intelligence terminal\
**Primary AI:** Google Gemini\
**Starting Point:** `bilawalsidhu/gods-eye-view`\
**License of starting repository:** MIT\
**Primary target:** Desktop web, fully responsive to tablet and mobile

------------------------------------------------------------------------

## 1. Executive Summary

NEXUS is a real-time AI news intelligence terminal designed to feel like
a modern investigative command center rather than a conventional news
website.

The product combines:

-   live/current news
-   source aggregation
-   story clustering
-   global event visualization
-   timelines
-   entity relationships
-   alerts
-   source comparison
-   Gemini-powered analysis
-   a persistent terminal-style "Ask Anything" interface

The core promise is:

> **Everything important is visible in one place, and anything can be
> investigated by asking the terminal.**

The interface should have a fictional intelligence-workstation aesthetic
inspired by professional intelligence, OSINT, investigative and
financial terminals. It must not imply that it is an actual FBI, CIA,
police, military or government system.

------------------------------------------------------------------------

# 2. Product Vision

### NEXUS

> **See what is happening. Understand why it matters. Ask anything.**

Traditional news requires users to jump between websites and manually
connect information.

NEXUS should instead create this workflow:

``` text
SEE
  ↓
NOTICE
  ↓
INVESTIGATE
  ↓
ASK GEMINI
  ↓
UNDERSTAND
  ↓
FOLLOW
```

The main dashboard should function as a persistent operational
workspace.

------------------------------------------------------------------------

# 3. Product Principles

### 3.1 One-screen intelligence

The user should be able to monitor the world without constantly opening
separate pages.

### 3.2 AI grounded in current information

Gemini must not be treated as a standalone oracle for current events.

The preferred architecture is:

``` text
User Question
    ↓
Search / News Retrieval
    ↓
Source Filtering
    ↓
Article Retrieval
    ↓
Deduplication / Clustering
    ↓
Gemini Analysis
    ↓
Structured Answer + Sources
```

### 3.3 Dense but readable

The UI should display a lot of information without looking cluttered.

### 3.4 Terminal first

The interface should feel operational:

-   timestamps
-   statuses
-   source counts
-   confidence indicators
-   live states
-   command-like interactions
-   compact typography
-   keyboard shortcuts

### 3.5 Responsive by design

Responsive behavior is part of the architecture, not a final CSS step.

### 3.6 Transparent sourcing

AI answers should make it obvious which information came from sources
and which is analysis.

------------------------------------------------------------------------

# 4. Target Users

## Primary Users

### News Power User

Follows global developments throughout the day.

### Researcher

Needs to quickly understand a developing topic.

### Analyst

Needs timelines, sources, entities and relationships.

### Technology / Business User

Needs rapid context around technology, AI, companies and markets.

### General User

Wants to ask:

> "What's happening right now?"

and get a useful, current answer.

------------------------------------------------------------------------

# 5. Core Experience

The primary desktop screen should resemble:

``` text
┌────────────────────────────────────────────────────────────────────────────┐
│ NEXUS // GLOBAL INTELLIGENCE TERMINAL          ● SYSTEM ONLINE 14:32:08   │
├──────────────┬──────────────────────────────────────┬─────────────────────┤
│ OPERATIONS   │                                      │ ALERTS              │
│              │          GLOBAL INTELLIGENCE         │                     │
│ GLOBAL       │                                      │ CRITICAL            │
│ INDIA        │              WORLD MAP               │ Developing...       │
│ US           │                                      │                     │
│ EUROPE       │      ●        ●          ●           │ HIGH                │
│ ASIA         │                                      │ Market movement     │
│ MIDDLE EAST  │          ●            ●              │                     │
│ TECH         │                                      │ INFO                │
│ BUSINESS     │                                      │ New report          │
├──────────────┴──────────────────────────────────────┴─────────────────────┤
│ LIVE INTELLIGENCE FEED                                                    │
├────────────────────────────────────────────────────────────────────────────┤
│ GEMINI // ANALYST                                                         │
│ > Ask anything_                                                           │
└────────────────────────────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 6. Main Dashboard

## 6.1 Header

Display:

-   NEXUS logo/name
-   GLOBAL INTELLIGENCE TERMINAL
-   LIVE status
-   system status
-   current time
-   last sync time
-   search
-   settings
-   AI status
-   source status
-   command palette

Example:

``` text
NEXUS // GLOBAL INTELLIGENCE TERMINAL

● SYSTEM ONLINE
● NEWS STREAM LIVE
● GEMINI READY

LAST SYNC 14:32:07 UTC
```

------------------------------------------------------------------------

# 7. Left Navigation

Primary navigation:

``` text
OPERATIONS

> GLOBAL
> INDIA
> US
> EUROPE
> ASIA
> MIDDLE EAST
> AFRICA

INTELLIGENCE

> BREAKING
> DEVELOPING
> TRENDING
> ANALYSIS
> INVESTIGATIONS

DOMAINS

> POLITICS
> BUSINESS
> MARKETS
> TECHNOLOGY
> AI
> SCIENCE
> DEFENCE
> CLIMATE
> CULTURE
```

Navigation should be collapsible.

------------------------------------------------------------------------

# 8. Global Intelligence Map

The existing God's Eye View project provides a strong conceptual
starting point because it already treats the browser as a real-time
intelligence console with live geographic data and natural-language
interaction.

For NEXUS, the map becomes a **news/event geography layer**.

## Map events

Potential categories:

-   breaking events
-   political developments
-   conflicts
-   protests
-   natural disasters
-   economic events
-   major technology events
-   climate events
-   major international incidents

Each event should be clickable.

Example:

``` text
EVENT // 047

LOCATION
New Delhi, India

STATUS
● DEVELOPING

SOURCES
18

LAST UPDATE
14:31 UTC
```

------------------------------------------------------------------------

# 9. Live Intelligence Feed

The feed is continuously updated.

Each item contains:

-   timestamp
-   category
-   headline
-   source
-   source count
-   development status
-   importance
-   geographic region

Example:

``` text
14:32:07  WORLD

MAJOR DEVELOPMENT REPORTED...

17 SOURCES
● DEVELOPING
```

The feed should update without full page reloads.

------------------------------------------------------------------------

# 10. Story Clustering

Multiple articles describing the same underlying event should be
grouped.

Instead of:

``` text
Article 1
Article 2
Article 3
Article 4
```

show:

``` text
DEVELOPMENT // 047

US–CHINA TRADE

27 ARTICLES
12 SOURCES
6 ENTITIES
4 DEVELOPMENTS

● DEVELOPING
```

This reduces duplication and creates a higher-level intelligence view.

------------------------------------------------------------------------

# 11. Investigation View

Selecting a story opens an investigation workspace.

``` text
CASE // 2026-0047

US–CHINA TRADE DEVELOPMENTS

STATUS
● DEVELOPING

IMPACT
HIGH

SOURCES
27

ENTITIES
14
```

## Timeline

``` text
08:14
Initial report

09:02
Official response

10:37
Market reaction

12:11
Additional statement

14:02
Latest development
```

## Investigation sections

-   summary
-   latest development
-   timeline
-   source list
-   source comparison
-   related stories
-   entities
-   locations
-   AI assessment
-   what to watch next

------------------------------------------------------------------------

# 12. Source Intelligence

Every important AI response should expose source information.

Example:

``` text
SOURCE INTELLIGENCE

Reuters       14:21
AP            14:18
BBC           14:12
Bloomberg     14:09

SOURCE CONSENSUS
HIGH
```

The system should distinguish:

### Reported

Information supported by retrieved sources.

### Analysis

Gemini's interpretation of retrieved information.

### Uncertainty

Conflicting, incomplete or unverified information.

------------------------------------------------------------------------

# 13. Gemini Analyst

The persistent AI terminal is the primary interaction mechanism.

``` text
GEMINI // ANALYST

> Ask anything_
```

Example questions:

``` text
What are the biggest stories right now?

What happened in India today?

Why is this important?

Give me the timeline.

What changed in the last six hours?

Which sources disagree?

What are the possible consequences?

Explain this in simple language.

What should I watch next?
```

------------------------------------------------------------------------

# 14. Gemini Response Format

Gemini should preferably return structured data.

Example:

``` json
{
  "summary": "...",
  "keyDevelopments": [],
  "whyItMatters": "...",
  "timeline": [],
  "entities": [],
  "locations": [],
  "whatToWatch": [],
  "sources": [],
  "confidence": "high"
}
```

The frontend should render the structured result into terminal-native
UI.

------------------------------------------------------------------------

# 15. Conversational Investigation

The AI must maintain context within an investigation.

Example:

``` text
USER
> What's happening with this story?

GEMINI
> Current summary...

USER
> Why?

GEMINI
> Context...

USER
> What happened before this?

GEMINI
> Timeline...

USER
> Which sources support that?

GEMINI
> Source comparison...

USER
> What should I watch next?

GEMINI
> Developing indicators...
```

------------------------------------------------------------------------

# 16. Terminal Command System

Support optional command-style navigation.

Examples:

``` text
/
Search

/ask
Ask Gemini

/global
Global news

/india
India

/breaking
Breaking

/tech
Technology

/markets
Markets

/search Nvidia

/story 047

/timeline

/sources
```

Natural language remains the primary interface.

------------------------------------------------------------------------

# 17. Alerts

Alert levels:

``` text
CRITICAL
HIGH
MEDIUM
INFO
```

Example:

``` text
[CRITICAL]

MAJOR DEVELOPMENT
MIDDLE EAST

14:31 UTC
```

Alerts should be visually obvious without becoming distracting.

------------------------------------------------------------------------

# 18. Trending Intelligence

Trending topics should use signals such as:

-   article volume
-   source diversity
-   update velocity
-   geographic spread
-   importance
-   development frequency

Example:

``` text
TRENDING

01  US–CHINA
████████████████

02  AI REGULATION
████████████

03  OIL PRICES
█████████

04  INDIA
███████
```

------------------------------------------------------------------------

# 19. Entity Intelligence

Users should be able to investigate entities.

Entity types:

-   people
-   organizations
-   companies
-   countries
-   cities
-   technologies
-   topics

Example:

``` text
ENTITY // NVIDIA

CURRENT DEVELOPMENTS
12

RELATED STORIES
47

LATEST
...

RELATED ENTITIES
...
```

------------------------------------------------------------------------

# 20. Search

Global search should search across:

-   stories
-   articles
-   entities
-   topics
-   countries
-   locations
-   historical information available in the system

Search should support both keyword and natural-language queries.

------------------------------------------------------------------------

# 21. Responsive Requirements

## Desktop --- 1440px+

Show the full intelligence workspace:

``` text
NAV | MAIN / MAP | ALERTS
    | LIVE FEED
    | AI TERMINAL
```

## Laptop --- 1024--1439px

Reduce secondary information and allow panels to collapse.

## Tablet

Use:

-   drawers
-   tabs
-   collapsible panels

## Mobile

Prioritize:

1.  breaking news
2.  Gemini analyst
3.  live feed
4.  investigation
5.  map

Do not simply squeeze the desktop UI into mobile.

------------------------------------------------------------------------

# 22. Visual Design System

## Overall Style

-   dark
-   technical
-   premium
-   dense
-   restrained
-   investigative
-   professional

## Typography

Use:

-   modern sans-serif for headlines
-   monospace for telemetry, timestamps and system information

## UI

Use:

-   thin borders
-   compact spacing
-   subtle grid
-   status indicators
-   small labels
-   data density
-   restrained glow
-   subtle scanline/noise effects

## Avoid

-   excessive neon
-   Matrix-style green overload
-   generic purple AI gradients
-   excessive glassmorphism
-   oversized rounded cards
-   excessive decorative animation

Target feeling:

> **A premium modern intelligence workstation.**

------------------------------------------------------------------------

# 23. Technical Architecture

``` text
                   NEWS SOURCES
                        │
                        ▼
                 NEWS INGESTION
                        │
                        ▼
               NORMALIZATION
                        │
                        ▼
             DEDUPLICATION / CLUSTER
                        │
                        ▼
                 INTELLIGENCE DB
                        │
             ┌──────────┴──────────┐
             │                     │
             ▼                     ▼
       SEARCH / RETRIEVAL       GEMINI
             │                     │
             └──────────┬──────────┘
                        ▼
                 STRUCTURED DATA
                        │
                        ▼
                   NEXUS UI
```

------------------------------------------------------------------------

# 24. Security

API credentials must never be exposed in the public browser bundle.

Use:

``` text
Browser
   ↓
NEXUS Backend
   ↓
Gemini / News Providers
```

Environment secrets:

``` text
GEMINI_API_KEY=...
NEWS_PROVIDER_KEY=...
```

`.env` must not be committed.

------------------------------------------------------------------------

# 25. Starting Repository

The implementation should begin from a fork/derived copy of:

`bilawalsidhu/gods-eye-view`

Reuse appropriate architecture and patterns where practical, but do not
force the existing product model onto the news product.

The original project is MIT licensed.

The existing project provides useful foundations around:

-   Vite
-   Cesium
-   real-time data
-   geospatial visualization
-   intelligence-console interaction
-   modular data sources
-   natural-language control

NEXUS should repurpose those strengths toward news intelligence.

------------------------------------------------------------------------

# 26. Installed MCP Stack

The current development environment has the following MCP integrations
enabled:

  MCP                Enabled Tools Primary Role
  ---------------- --------------- -------------------------------------------
  StitchMCP                     15 UI/UX generation and design iteration
  context7                       2 Current technical documentation
  data-agent-kit                 4 Data/retrieval/agent workflows
  notebooks                     11 Data analysis, experiments and research
  shadcn                         7 UI component implementation/reference
  supabase                      29 Database, auth and backend infrastructure
  threejs                       60 3D visualization
  visualization                  1 Data visualization

**Important:** MCP tools are development/productivity capabilities. They
should be used where they improve implementation; they should not
unnecessarily become runtime dependencies.

------------------------------------------------------------------------

# 27. MCP Use Cases --- StitchMCP

## Role

StitchMCP is the primary UI exploration and design-generation tool.

### Use Case 1 --- Generate the initial NEXUS dashboard

Generate the desktop intelligence-terminal shell with:

-   navigation
-   global map
-   live feed
-   alerts
-   Gemini panel
-   system status

### Use Case 2 --- Generate responsive layouts

Create and validate:

-   1920×1080
-   1440×900
-   1280×800
-   tablet
-   mobile

### Use Case 3 --- Explore UI alternatives

Generate variations for:

-   news rows
-   alert cards
-   source panels
-   story cards
-   timeline
-   AI terminal
-   command palette
-   entity panels

### Use Case 4 --- Investigation screen

Generate the case/investigation workspace.

### Use Case 5 --- Visual QA

Compare implemented screens against the chosen Stitch design and
iterate.

### Rule

Stitch should accelerate visual design. The final production
implementation remains in the NEXUS codebase.

------------------------------------------------------------------------

# 28. MCP Use Cases --- context7

## Role

Context7 is the project's documentation lookup layer.

Use it whenever implementation depends on a library/framework API whose
current behavior matters.

### Three.js

Use for:

-   scene architecture
-   cameras
-   rendering
-   animation
-   performance
-   interaction

### Supabase

Use for:

-   database queries
-   authentication
-   realtime subscriptions
-   server/client integration
-   current SDK syntax

### Shadcn

Use for:

-   component APIs
-   installation patterns
-   component composition
-   accessibility behavior

### Vite

Use for:

-   configuration
-   environment handling
-   build/deployment behavior

### Gemini

Use current official documentation for:

-   Gemini SDK/API
-   structured output
-   streaming
-   tool/function calling
-   model configuration
-   authentication

### Rule

Before implementing unfamiliar or potentially changed APIs:

> **Consult context7/current documentation first.**

Do not rely on stale generated examples when the current library API can
be checked.

------------------------------------------------------------------------

# 29. MCP Use Cases --- data-agent-kit

## Role

Use data-agent-kit for data-oriented agent and retrieval workflows where
its available tools fit the implementation.

Potential use cases:

-   building news retrieval workflows
-   transforming retrieved news into structured records
-   agent-assisted data processing
-   connecting retrieved information to downstream analysis
-   prototyping data pipelines

### Example

``` text
News Search
    ↓
data-agent-kit
    ↓
Normalize / structure
    ↓
Story clustering
    ↓
Gemini
```

Exact implementation should follow the currently exposed MCP tool
schemas.

------------------------------------------------------------------------

# 30. MCP Use Cases --- notebooks

## Role

Use notebooks for research, data exploration and validation.

Potential use cases:

### News-source experiments

Analyze:

-   source frequency
-   article volume
-   timestamps
-   duplicate rates

### Clustering experiments

Test whether articles are correctly grouped into stories.

### Ranking experiments

Experiment with:

``` text
importance =
  source diversity
+ update velocity
+ article volume
+ geographic spread
```

### Gemini evaluation

Create evaluation datasets to measure:

-   groundedness
-   citation coverage
-   answer consistency
-   source agreement
-   latency

### Visualization experiments

Prototype:

-   trend charts
-   timelines
-   event graphs
-   geographic data

Notebooks should primarily be used for experimentation and validation,
not as the production application runtime.

------------------------------------------------------------------------

# 31. MCP Use Cases --- shadcn

## Role

Use shadcn MCP for production UI component patterns.

Potential components:

-   dialogs
-   drawers
-   command palette
-   tabs
-   dropdowns
-   tooltips
-   alerts
-   sheets
-   cards
-   inputs
-   skeleton loaders

The visual treatment should be customized to the NEXUS design system
rather than using default shadcn styling unchanged.

------------------------------------------------------------------------

# 32. MCP Use Cases --- Supabase

## Role

Supabase should provide backend infrastructure where appropriate.

Potential uses:

### Database

Store:

-   articles
-   stories
-   sources
-   entities
-   events
-   timelines
-   user preferences
-   saved investigations

### Authentication

Optional user accounts.

### Realtime

Push:

-   new articles
-   story updates
-   alerts
-   status changes

### Storage

Potentially store:

-   cached media
-   generated assets
-   investigation artifacts

### Example schema

``` text
sources
articles
stories
story_articles
entities
story_entities
events
story_events
users
saved_stories
watchlists
ai_conversations
```

------------------------------------------------------------------------

# 33. MCP Use Cases --- Three.js

## Role

Three.js is the preferred foundation for advanced 3D visualization if
the NEXUS experience uses a custom 3D world/event visualization layer.

Potential uses:

-   3D globe
-   event visualization
-   animated event markers
-   geographic connections
-   3D intelligence visualization
-   event relationship visualization

### Important

Do not add 3D merely because Three.js is installed.

The default MVP should prioritize information utility and performance.

3D should be used where it improves understanding.

------------------------------------------------------------------------

# 34. MCP Use Cases --- visualization

Use the visualization MCP for appropriate analytical graphics.

Potential outputs:

-   trend charts
-   source distribution
-   timeline visualization
-   topic velocity
-   geographic summaries
-   source consensus
-   article volume

Charts should remain consistent with the terminal visual system.

------------------------------------------------------------------------

# 35. MCP Workflow

The recommended development loop is:

``` text
PRD
 ↓
StitchMCP
 ↓
UI/UX concept
 ↓
shadcn
 ↓
Production components
 ↓
context7
 ↓
Current API implementation
 ↓
Supabase
 ↓
Data layer
 ↓
data-agent-kit
 ↓
Retrieval / agent workflows
 ↓
Gemini
 ↓
AI intelligence
 ↓
Three.js / visualization
 ↓
Advanced visualization
 ↓
notebooks
 ↓
Validation / experimentation
```

------------------------------------------------------------------------

# 36. Development Rules

### Rule 1

Use MCP tools according to their actual exposed capabilities.

### Rule 2

Do not invent MCP functions that are not available.

### Rule 3

Use context7 for current library documentation instead of assuming APIs.

### Rule 4

Use StitchMCP for visual exploration, not as a replacement for
production engineering.

### Rule 5

Keep secrets server-side.

### Rule 6

Do not make every MCP integration a production dependency.

### Rule 7

Prefer simple architecture until the feature genuinely requires
complexity.

------------------------------------------------------------------------

# 37. MVP Scope

## Must Have

### Terminal UI

-   dark intelligence interface
-   responsive layout
-   navigation
-   status bar
-   command palette

### News

-   current news ingestion
-   live feed
-   categories
-   search
-   story clustering
-   source information

### AI

-   Gemini integration
-   Ask Anything
-   contextual follow-up
-   streaming responses
-   source-grounded answers
-   citations/source references

### Investigation

-   story view
-   timeline
-   sources
-   related stories
-   entities
-   AI analysis

### Visualization

-   event map
-   basic event markers
-   trend visualization

------------------------------------------------------------------------

# 38. Phase 2

Add:

-   source comparison
-   entity intelligence
-   historical comparisons
-   personalized watchlists
-   saved investigations
-   alerts
-   advanced map layers
-   advanced command system
-   market/news correlation

------------------------------------------------------------------------

# 39. Phase 3

Add an intelligence relationship graph:

``` text
PERSON
  │
  ├── ORGANIZATION
  │
  ├── LOCATION
  │
  ├── STORY
  │
  └── EVENT
```

Allow the user to ask:

> "Show me everything connected to this event."

------------------------------------------------------------------------

# 40. Keyboard Shortcuts

``` text
/
Search

A
Ask Gemini

B
Breaking

G
Global

I
Investigation

T
Timeline

S
Sources

Esc
Close

?
Shortcut help
```

------------------------------------------------------------------------

# 41. Performance Requirements

Target:

-   initial load under 3 seconds on a reasonable desktop connection
-   no full-page reload for feed updates
-   streaming AI responses
-   lazy loading of expensive visualization layers
-   efficient virtualization for long feeds
-   mobile-friendly rendering
-   graceful degradation if map/3D features are unavailable

------------------------------------------------------------------------

# 42. Reliability Requirements

The system must distinguish:

``` text
CONFIRMED
REPORTED
DEVELOPING
UNCONFIRMED
CONFLICTING
```

Example:

``` text
SOURCE CONFLICT DETECTED

SOURCE A
...

SOURCE B
...

CURRENT ASSESSMENT
Information remains conflicting.
```

Gemini must not turn uncertainty into certainty.

------------------------------------------------------------------------

# 43. Success Metrics

## Product

-   questions per session
-   follow-up questions
-   stories investigated
-   search usage
-   session duration

## News

-   source coverage
-   freshness
-   clustering accuracy
-   duplicate reduction

## AI

-   grounded answer rate
-   citation coverage
-   response latency
-   user correction rate
-   source agreement

## Performance

-   initial load
-   API latency
-   mobile performance
-   visualization FPS

------------------------------------------------------------------------

# 44. Definition of Done --- MVP

A user can:

1.  Open NEXUS.
2.  Immediately see current news.
3.  See major events geographically.
4.  Search for a topic.
5.  Open a story cluster.
6.  See its timeline.
7.  See the underlying sources.
8.  Ask Gemini about the story.
9.  Ask contextual follow-up questions.
10. Receive current, source-grounded analysis.
11. See source references.
12. Use the interface on desktop, tablet and mobile.
13. Navigate primarily from one unified workspace.
14. Use keyboard shortcuts.
15. Never expose provider API keys in the browser.

------------------------------------------------------------------------

# 45. First Build Milestone

The first implementation milestone should be:

## MILESTONE 01 --- TERMINAL SHELL

Build only the visual/interaction shell:

-   NEXUS header
-   left navigation
-   center intelligence area
-   right alerts
-   live feed
-   Gemini terminal
-   responsive behavior
-   command palette
-   status indicators
-   loading states
-   empty states

Use StitchMCP for visual exploration and shadcn for appropriate
primitives.

Do not build the complete news backend yet.

------------------------------------------------------------------------

# 46. Second Build Milestone

## MILESTONE 02 --- NEWS ENGINE

Implement:

-   source ingestion
-   normalization
-   article storage
-   search
-   story clustering
-   live feed
-   event extraction

Use:

-   Supabase
-   data-agent-kit where appropriate
-   notebooks for clustering/ranking experiments
-   context7 for current SDK/API documentation

------------------------------------------------------------------------

# 47. Third Build Milestone

## MILESTONE 03 --- GEMINI ANALYST

Implement:

``` text
ASK
 ↓
RETRIEVE
 ↓
GROUND
 ↓
ANALYZE
 ↓
STREAM
 ↓
CITE
```

Add:

-   conversation context
-   structured responses
-   source citations
-   confidence
-   timeline generation
-   "why it matters"
-   "what to watch"

------------------------------------------------------------------------

# 48. Fourth Build Milestone

## MILESTONE 04 --- INTELLIGENCE VISUALIZATION

Implement:

-   event map
-   event markers
-   trend visualization
-   story relationships
-   entity relationships

Use Three.js only where 3D provides genuine value.

------------------------------------------------------------------------

# 49. Fifth Build Milestone

## MILESTONE 05 --- POLISH + RESPONSIVE

Validate:

-   1920×1080
-   1440×900
-   1280×800
-   1024px
-   tablet
-   390px mobile
-   430px mobile

Use StitchMCP for visual refinement and notebooks/visualization for
analytical QA where useful.

------------------------------------------------------------------------

# 50. Final Product Definition

NEXUS is successful when it no longer feels like:

> "A news website with a chatbot."

It should feel like:

> **An AI-native global news intelligence operating system.**

The user opens one screen and sees the world.

They click an event and understand the story.

They ask Gemini and investigate further.

They follow the sources.

They watch the story develop.

### Product mantra

> **SEE THE WORLD.\
> UNDERSTAND THE SIGNAL.\
> ASK ANYTHING.**
