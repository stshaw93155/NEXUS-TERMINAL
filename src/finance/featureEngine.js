/**
 * Technical Feature Engine
 * Calculates quantitative indicators (SMA, RSI, MACD, Volatility) for the Forecasting Engine.
 */
export class TechnicalFeatureEngine {
  
  /**
   * Main entry point to compute all technical features for a given OHLCV dataset
   */
  computeFeatures(historicalData) {
    if (!historicalData || historicalData.length < 50) {
      console.warn('[FeatureEngine] Not enough data to compute stable features');
      return [];
    }

    // Ensure data is sorted oldest to newest
    const sorted = [...historicalData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const closes = sorted.map(d => d.close);
    
    const sma20 = this.calculateSMA(closes, 20);
    const sma50 = this.calculateSMA(closes, 50);
    const rsi14 = this.calculateRSI(closes, 14);
    const macd = this.calculateMACD(closes);
    
    // We attach features to the most recent data points where all indicators are valid
    const featureSet = [];
    
    for (let i = 50; i < sorted.length; i++) {
      featureSet.push({
        date: sorted[i].date,
        close: sorted[i].close,
        volume: sorted[i].volume,
        sma20: sma20[i],
        sma50: sma50[i],
        rsi14: rsi14[i],
        macdLine: macd.macdLine[i],
        macdSignal: macd.signalLine[i],
        macdHist: macd.histogram[i],
        // Distance from moving averages (mean reversion signals)
        distSma20: (sorted[i].close - sma20[i]) / sma20[i],
        distSma50: (sorted[i].close - sma50[i]) / sma50[i],
      });
    }

    return featureSet;
  }

  calculateSMA(prices, period) {
    const sma = new Array(prices.length).fill(null);
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma[i] = sum / period;
    }
    return sma;
  }

  calculateEMA(prices, period) {
    const ema = new Array(prices.length).fill(null);
    const multiplier = 2 / (period + 1);
    
    // Start with SMA for the first valid data point
    let initialSMA = 0;
    for (let i = 0; i < period; i++) initialSMA += prices[i];
    initialSMA /= period;
    
    ema[period - 1] = initialSMA;
    
    for (let i = period; i < prices.length; i++) {
      ema[i] = (prices[i] - ema[i - 1]) * multiplier + ema[i - 1];
    }
    return ema;
  }

  calculateRSI(prices, period) {
    const rsi = new Array(prices.length).fill(null);
    let gains = 0, losses = 0;

    for (let i = 1; i <= period; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff > 0) gains += diff;
      else losses -= diff;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;
    
    rsi[period] = avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss));

    for (let i = period + 1; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? -diff : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      
      rsi[i] = avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss));
    }
    
    return rsi;
  }

  calculateMACD(prices) {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    
    const macdLine = new Array(prices.length).fill(null);
    for (let i = 25; i < prices.length; i++) {
      macdLine[i] = ema12[i] - ema26[i];
    }
    
    // We need to calculate a 9-period EMA of the MACD line
    const signalLine = new Array(prices.length).fill(null);
    const histogram = new Array(prices.length).fill(null);
    
    // Start calculating signal from index 34 (26 + 9 - 1)
    if (prices.length > 34) {
      let initialSMA = 0;
      for (let i = 25; i < 34; i++) initialSMA += macdLine[i];
      initialSMA /= 9;
      
      signalLine[33] = initialSMA;
      histogram[33] = macdLine[33] - signalLine[33];
      
      const multiplier = 2 / (9 + 1);
      for (let i = 34; i < prices.length; i++) {
        signalLine[i] = (macdLine[i] - signalLine[i - 1]) * multiplier + signalLine[i - 1];
        histogram[i] = macdLine[i] - signalLine[i];
      }
    }
    
    return { macdLine, signalLine, histogram };
  }
}

export const technicalFeatureEngine = new TechnicalFeatureEngine();
