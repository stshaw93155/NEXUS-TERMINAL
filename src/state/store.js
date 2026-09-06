/**
 * NEXUS - Reactive State Store
 */

import { MOCK_STORIES, MOCK_ALERTS, MOCK_TRENDING, MOCK_GEMINI_KNOWLEDGE } from './mockData.js';

class TerminalStore {
  constructor() {
    this.state = {
      layerManager: null,
      activeRegion: 'GLOBAL',
      activeFilter: 'ALL',
      activeDomain: 'ALL',
      searchQuery: '',
      selectedStoryId: null,
      stories: [...MOCK_STORIES],
      alerts: [...MOCK_ALERTS],
      trending: [...MOCK_TRENDING],
      terminalMessages: [
        {
          id: 'msg-init',
          role: 'gemini',
          timestamp: 'SYSTEM BOOT',
          data: MOCK_GEMINI_KNOWLEDGE.defaultAnswer
        }
      ],
      terminalStatus: 'READY',
      navCollapsed: false,
      terminalExpanded: false,
      terminalCollapsed: false,
      audioEnabled: true,
      scanlinesEnabled: true,
      activeMobileTab: 'feed', // 'feed' | 'map' | 'alerts' | 'terminal'
      lastSyncTime: new Date(),
      activeEntity: null, // { type: 'flight' | 'vessel' | 'cctv', id: string, data: object }
      gdeltStats: {
        status: 'IDLE',
        lastFetch: null,
        fetched: 0,
        newInserted: 0,
        duplicatesSkipped: 0
      },
      latestToast: null
    };

    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error('Store listener error:', err);
      }
    }
  }

  getState() {
    return this.state;
  }

  setActiveEntity(type, id, data) {
    this.state.activeEntity = { type, id, data };
    this.notify();
  }

  clearActiveEntity() {
    this.state.activeEntity = null;
    this.notify();
  }

  setLayerManager(manager) {
    this.state.layerManager = manager;
    this.notify();
  }

  setRegion(region) {
    this.state.activeRegion = region;
    this.notify();
  }

  setFilter(filter) {
    this.state.activeFilter = filter;
    this.notify();
  }

  setDomain(domain) {
    this.state.activeDomain = domain;
    this.notify();
  }

  setSearchQuery(query) {
    this.state.searchQuery = query;
    this.notify();
  }

  selectStory(storyId) {
    this.state.selectedStoryId = storyId;
    this.notify();
  }

  closeInvestigation() {
    this.state.selectedStoryId = null;
    this.notify();
  }

  toggleNav() {
    this.state.navCollapsed = !this.state.navCollapsed;
    this.notify();
  }

  toggleTerminalExpand() {
    this.state.terminalExpanded = !this.state.terminalExpanded;
    if (this.state.terminalExpanded) {
      this.state.terminalCollapsed = false;
    }
    this.notify();
  }

  toggleTerminalCollapse() {
    this.state.terminalCollapsed = !this.state.terminalCollapsed;
    if (this.state.terminalCollapsed) {
      this.state.terminalExpanded = false;
    }
    this.notify();
  }

  toggleAudio() {
    this.state.audioEnabled = !this.state.audioEnabled;
    this.notify();
  }

  toggleScanlines() {
    this.state.scanlinesEnabled = !this.state.scanlinesEnabled;
    document.body.classList.toggle('no-scanlines', !this.state.scanlinesEnabled);
    this.notify();
  }

  setMobileTab(tab) {
    this.state.activeMobileTab = tab;
    this.notify();
  }

  addTerminalMessage(msg) {
    this.state.terminalMessages.push(msg);
    this.notify();
  }

  setTerminalStatus(status) {
    this.state.terminalStatus = status;
    this.notify();
  }

  getFilteredStories() {
    const { activeRegion, activeFilter, activeDomain, searchQuery, stories } = this.state;
    return stories.filter(story => {
      // Region filter
      if (activeRegion !== 'GLOBAL' && story.region !== activeRegion) {
        return false;
      }
      // Filter (Breaking, Developing, etc.)
      if (activeFilter === 'BREAKING' && story.importance !== 'CRITICAL') {
        return false;
      }
      if (activeFilter === 'DEVELOPING' && story.status !== 'DEVELOPING') {
        return false;
      }
      if (activeFilter === 'ANALYSIS' && story.category !== 'AI' && story.category !== 'TECHNOLOGY') {
        return false;
      }
      // Domain filter
      if (activeDomain !== 'ALL' && story.category !== activeDomain) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = story.title.toLowerCase().includes(q);
        const matchesHeadline = story.headline.toLowerCase().includes(q);
        const matchesLocation = story.location.toLowerCase().includes(q);
        const matchesEntities = story.entities.some(e => e.name.toLowerCase().includes(q));
        if (!matchesTitle && !matchesHeadline && !matchesLocation && !matchesEntities) {
          return false;
        }
      }
      return true;
    });
  }

  updateStories(newStories) {
    const existingIds = new Set(this.state.stories.map(s => s.id));
    const uniqueNew = newStories.filter(s => !existingIds.has(s.id));
    
    if (uniqueNew.length > 0 || newStories.length === 0) {
      // Prepend unique new stories
      let merged = [...uniqueNew, ...this.state.stories];
      
      // Sort by time (assuming time is a string like "14:32 UTC", we can just sort by original order or attempt a basic sort)
      // Since it's a live feed, prepending unique new ones is usually sufficient to keep the newest at the top.
      
      this.state.stories = merged.slice(0, 150); // Keep max 150 to prevent memory leaks
      this.notify();
    }
  }

  updateGdeltStats(stats) {
    this.state.gdeltStats = { ...this.state.gdeltStats, ...stats };
    this.notify();
  }

  updateAlerts(newAlerts) {
    const existingIds = new Set(this.state.alerts.map(a => a.id));
    const uniqueNew = newAlerts.filter(a => !existingIds.has(a.id));
    
    if (uniqueNew.length > 0 || newAlerts.length === 0) {
      let merged = [...uniqueNew, ...this.state.alerts];
      this.state.alerts = merged.slice(0, 50); // Keep max 50 alerts
      this.notify();
    }
  }

  updateTrending(newTrending) {
    this.state.trending = newTrending;
    this.notify();
  }

  showToast(title, message, level = 'INFO') {
    this.state.latestToast = { title, message, level, id: Date.now() };
    this.notify();
  }
}

export const store = new TerminalStore();
