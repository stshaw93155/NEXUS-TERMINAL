import { securityMaster } from './securityMaster.js';

/**
 * Market Data Fetcher
 * Simulates OHLCV data for Paper Mode / Local Development.
 * In production, this would use a backend proxy to Polygon.io or Yahoo Finance.
 */
export class MarketDataFetcher {
  constructor() {
    this.paperMode = true; // Hardcoded for initial experimental phase
  }

  async getHistoricalData(symbol, days = 100) {
    console.log(`[MarketData] Fetching ${days} days of history for ${symbol}...`);
    
    // If we are in paper mode, generate synthetic walk-forward data
    if (this.paperMode) {
      return this._generateSyntheticData(symbol, days);
    }

    // Production code would call the Vercel Serverless Function here:
    // const res = await fetch(`/api/finance/history?symbol=${symbol}&days=${days}`);
    // return res.json();
  }

  _generateSyntheticData(symbol, days) {
    const data = [];
    let currentPrice = 150.0;
    
    // Seed price based on symbol for variety
    if (symbol === 'AAPL') currentPrice = 180.0;
    if (symbol === 'TSLA') currentPrice = 220.0;
    if (symbol === 'NVDA') currentPrice = 450.0;
    if (symbol.includes('.NS')) currentPrice = 2500.0;

    let now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      // Skip weekends
      const day = date.getDay();
      if (day === 0 || day === 6) continue;

      // Random daily volatility (between -2% and +2.2% to simulate upward drift)
      const volatility = 0.02; 
      const drift = 0.0002;
      const randomShock = (Math.random() - 0.48) * volatility;
      
      const open = currentPrice;
      const close = currentPrice * (1 + randomShock + drift);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.floor(Math.random() * 50000000) + 10000000;

      data.push({
        date: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume
      });

      currentPrice = close;
    }

    return data;
  }
}

export const marketDataFetcher = new MarketDataFetcher();
