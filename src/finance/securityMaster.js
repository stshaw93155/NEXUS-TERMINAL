/**
 * Global Security Master and Exchange Registry
 * This acts as the canonical database of globally traded securities.
 * For Phase 1-3, this is an in-memory/JSON-backed store simulating a Postgres relational database.
 */

export const EXCHANGES = [
  { id: 'EX-US-NYSE', name: 'New York Stock Exchange', MIC: 'XNYS', country: 'US', currency: 'USD', timezone: 'America/New_York', dataCoverage: 'HIGH' },
  { id: 'EX-US-NASD', name: 'NASDAQ', MIC: 'XNAS', country: 'US', currency: 'USD', timezone: 'America/New_York', dataCoverage: 'HIGH' },
  { id: 'EX-IN-NSE', name: 'National Stock Exchange of India', MIC: 'XNSE', country: 'IN', currency: 'INR', timezone: 'Asia/Kolkata', dataCoverage: 'MEDIUM' },
  { id: 'EX-UK-LSE', name: 'London Stock Exchange', MIC: 'XLON', country: 'UK', currency: 'GBP', timezone: 'Europe/London', dataCoverage: 'HIGH' },
  { id: 'EX-JP-TSE', name: 'Tokyo Stock Exchange', MIC: 'XTKS', country: 'JP', currency: 'JPY', timezone: 'Asia/Tokyo', dataCoverage: 'MEDIUM' }
];

export const SECURITIES = [
  { id: 'SEC-AAPL', symbol: 'AAPL', name: 'Apple Inc.', exchangeId: 'EX-US-NASD', sector: 'Technology', assetType: 'EQUITY' },
  { id: 'SEC-MSFT', symbol: 'MSFT', name: 'Microsoft Corp.', exchangeId: 'EX-US-NASD', sector: 'Technology', assetType: 'EQUITY' },
  { id: 'SEC-TSLA', symbol: 'TSLA', name: 'Tesla Inc.', exchangeId: 'EX-US-NASD', sector: 'Consumer Cyclical', assetType: 'EQUITY' },
  { id: 'SEC-NVDA', symbol: 'NVDA', name: 'NVIDIA Corp.', exchangeId: 'EX-US-NASD', sector: 'Technology', assetType: 'EQUITY' },
  { id: 'SEC-JPM', symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchangeId: 'EX-US-NYSE', sector: 'Financial Services', assetType: 'EQUITY' },
  { id: 'SEC-RELI', symbol: 'RELIANCE.NS', name: 'Reliance Industries', exchangeId: 'EX-IN-NSE', sector: 'Energy', assetType: 'EQUITY' },
  { id: 'SEC-VOD', symbol: 'VOD.L', name: 'Vodafone Group', exchangeId: 'EX-UK-LSE', sector: 'Communication Services', assetType: 'EQUITY' },
  { id: 'SEC-TM', symbol: '7203.T', name: 'Toyota Motor Corp', exchangeId: 'EX-JP-TSE', sector: 'Consumer Cyclical', assetType: 'EQUITY' },
];

export class SecurityMaster {
  getExchange(id) {
    return EXCHANGES.find(ex => ex.id === id);
  }

  getSecurity(symbol) {
    return SECURITIES.find(s => s.symbol === symbol);
  }

  getSecurityById(id) {
    return SECURITIES.find(s => s.id === id);
  }

  getAllSecurities() {
    return SECURITIES;
  }
}

export const securityMaster = new SecurityMaster();
