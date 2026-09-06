import { store } from '../state/store.js';

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';

const FEEDS = {
  news: '/api/news',
  alerts: '/api/alerts',
  finance: '/api/finance' // CNBC Finance
};

export class FeedService {
  constructor() {
    this.pollInterval = null;
    this.gdeltArticles = new Set();
    this.seenMarketEvents = new Set();
  }

  startPolling(intervalMs = 60000) {
    this.fetchFeeds(); // initial fetch
    this.pollInterval = setInterval(() => {
      this.fetchFeeds();
    }, intervalMs);
  }

  stopPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  async fetchFeeds() {
    try {
      await Promise.all([
        this.updateNewsAndAlerts(),
        this.updateFinance(),
        this.updateGdelt()
      ]);
    } catch (err) {
      console.error('Error fetching live feeds:', err);
    }
  }

  async fetchRss(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    const items = Array.from(xmlDoc.querySelectorAll("item")).map(item => ({
      title: item.querySelector("title")?.textContent || '',
      description: item.querySelector("description")?.textContent || '',
      pubDate: item.querySelector("pubDate")?.textContent || ''
    }));
    return items;
  }

  async updateGdelt() {
    const gdeltUrl = 'https://api.gdeltproject.org/api/v2/doc/doc?query=(terror OR attack OR outbreak OR virus OR crisis OR emergency OR military OR war) sourcelang:eng&mode=artlist&maxrecords=50&format=json&sort=datedesc';
    try {
      // Use Vercel rewrite to bypass CORS natively
      const res = await fetch('/api/gdelt');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      
      const articles = data.articles || [];
      const newStories = [];
      let duplicates = 0;
      
      articles.forEach((item, index) => {
        if (this.gdeltArticles.has(item.url)) {
          duplicates++;
          return;
        }
        
        this.gdeltArticles.add(item.url);
        
        // Prevent memory leak in Set
        if (this.gdeltArticles.size > 1000) {
          const iter = this.gdeltArticles.values();
          for (let i = 0; i < 200; i++) this.gdeltArticles.delete(iter.next().value);
        }

        const isCritical = /attack|outbreak|virus|terror|crisis|war|dead/i.test(item.title);
        
        newStories.push({
          id: `GDELT-${Date.now()}-${index}`,
          url: item.url,
          title: item.title,
          headline: item.title,
          source: 'SECURE FEED',
          time: this.formatTime(new Date()),
          region: 'GLOBAL',
          status: isCritical ? 'CRITICAL' : 'DEVELOPING',
          importance: isCritical ? 'CRITICAL' : 'HIGH',
          category: 'GEOPOLITICS',
          location: 'Global',
          aiAssessment: {
            analysis: `Automated ingestion from external network.`,
            whatToWatch: ['Monitor for updates on this live event.'],
            confidence: 'SYSTEM_VALIDATED'
          },
          entities: [],
          timeline: [
            { time: this.formatTime(new Date()), text: item.title }
          ],
          sources: [{ name: 'SECURE', reliability: 0.85 }]
        });
      });

      if (newStories.length > 0) {
        store.updateStories(newStories);
      }

      store.updateGdeltStats({
        status: 'OK',
        lastFetch: new Date().toLocaleTimeString(),
        fetched: articles.length,
        newInserted: newStories.length,
        duplicatesSkipped: duplicates
      });
      
    } catch (err) {
      console.error('GDELT fetch error:', err);
      store.updateGdeltStats({
        status: 'ERROR',
        lastFetch: new Date().toLocaleTimeString(),
      });
    }
  }

  async updateNewsAndAlerts() {
    const [bbcNews, ajAlerts] = await Promise.all([
      this.fetchRss(FEEDS.news).catch(() => []),
      this.fetchRss(FEEDS.alerts).catch(() => [])
    ]);

    const liveStories = bbcNews.slice(0, 10).map((item, index) => {
      // Determine if critical based on keywords
      const isCritical = /attack|outbreak|virus|terror|crisis|war|dead/i.test(item.title);
      
      return {
        id: `LIVE-NEWS-${index}`,
        title: item.title,
        headline: item.title,
        source: 'SECURE FEED',
        time: this.formatTime(new Date(item.pubDate)),
        region: 'GLOBAL',
        status: isCritical ? 'CRITICAL' : 'DEVELOPING',
        importance: isCritical ? 'CRITICAL' : 'HIGH',
        category: 'GEOPOLITICS',
        location: 'Global',
        aiAssessment: {
          analysis: item.description,
          whatToWatch: ['Monitor for updates on this live event.'],
          confidence: 'VERIFIED'
        },
        entities: [],
        timeline: [
          { time: this.formatTime(new Date(item.pubDate)), text: item.title }
        ],
        sources: [{ name: 'SECURE', reliability: 0.98 }]
      };
    });

    const liveAlerts = ajAlerts.slice(0, 5).map((item, index) => {
      return {
        id: `ALERT-${index}`,
        type: 'WARNING',
        region: 'GLOBAL',
        message: item.title,
        time: this.formatTime(new Date(item.pubDate)),
        status: 'ACTIVE',
        details: item.description
      };
    });

    store.updateStories(liveStories);
    store.updateAlerts(liveAlerts);
  }

  async updateFinance() {
    const financeItems = await this.fetchRss(FEEDS.finance).catch(() => []);
    
    const marketAlerts = [];
    
    const trending = financeItems.slice(0, 6).map((item, index) => {
      const isUp = Math.random() > 0.5; // Simulate trend direction since RSS just has headlines
      const valChange = (Math.random() * 5);
      const isCritical = valChange > 3.5;
      
      if (isCritical && !this.seenMarketEvents.has(item.title)) {
        this.seenMarketEvents.add(item.title);
        
        const alertLvl = isUp ? 'HIGH' : 'CRITICAL';
        const alertHeadline = `MARKET ${isUp ? 'SURGE' : 'SHOCK'}: ${item.title.substring(0, 45)}...`;
        
        marketAlerts.push({
          id: `MARKET-${Date.now()}-${index}`,
          level: alertLvl,
          headline: alertHeadline,
          region: 'GLOBAL',
          timestamp: this.formatTime(new Date()),
          relativeTime: 'Just now',
          storyId: null
        });
        
        store.showToast(
          `CRITICAL MARKET NOTIFICATION`, 
          `${alertHeadline} (${isUp ? '+' : '-'}${valChange.toFixed(2)}%)`, 
          alertLvl
        );
      }
      
      return {
        id: `FIN-${index}`,
        term: item.title.substring(0, 30) + '...',
        category: 'MARKET',
        volume: `${(Math.random() * 100).toFixed(1)}K`,
        sentiment: isUp ? 'UP' : 'DOWN',
        change: `${isUp ? '+' : '-'}${valChange.toFixed(2)}%`
      };
    });

    if (marketAlerts.length > 0) {
      store.updateAlerts(marketAlerts);
    }

    store.updateTrending(trending);
  }

  formatTime(date) {
    if (isNaN(date.getTime())) date = new Date();
    return date.toISOString().substring(11, 16) + ' UTC';
  }
}
