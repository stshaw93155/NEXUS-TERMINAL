import { marketDataFetcher } from './marketData.js';
import { technicalFeatureEngine } from './featureEngine.js';
import { securityMaster } from './securityMaster.js';

/**
 * Quantitative Forecasting Engine
 * Produces probabilistic forecasts for the NEXT trading session.
 */
export class ForecastingEngine {
  
  async runForecastForSymbol(symbol) {
    console.log(`[ForecastingEngine] Initiating scan for ${symbol}...`);
    const security = securityMaster.getSecurity(symbol);
    if (!security) throw new Error(`Security ${symbol} not found in master.`);

    // 1. Fetch Data
    const history = await marketDataFetcher.getHistoricalData(symbol, 150);
    
    // 2. Feature Engineering
    const features = technicalFeatureEngine.computeFeatures(history);
    if (features.length === 0) return null;

    // The most recent feature vector (yesterday's close)
    const latest = features[features.length - 1];

    // 3. Quantitative Model Inference (Simulated Logistic Regression / Rules-based)
    // We compute a raw 'bullishness' score based on mean-reversion and momentum
    let score = 0;

    // RSI Reversion
    if (latest.rsi14 < 30) score += 2; // Oversold
    else if (latest.rsi14 > 70) score -= 2; // Overbought
    else if (latest.rsi14 > 50) score += 0.5; // Uptrend

    // MACD Momentum
    if (latest.macdHist > 0 && latest.macdHist > features[features.length - 2].macdHist) score += 1.5; // Accelerating momentum
    if (latest.macdHist < 0) score -= 1;

    // Moving Average Trend
    if (latest.close > latest.sma50) score += 1;
    if (latest.sma20 > latest.sma50) score += 1;

    // Extreme mean reversion (if price is way below SMA20)
    if (latest.distSma20 < -0.05) score += 1.5;
    if (latest.distSma20 > 0.05) score -= 1.5;

    // 4. Probability Calibration (Softmax-like conversion)
    // Map score (-5 to +5) to probabilities
    const normalized = Math.max(-5, Math.min(5, score));
    
    // Base probabilities
    let probUp = 0.33;
    let probDown = 0.33;
    let probFlat = 0.34;

    if (normalized > 0) {
      probUp += (normalized / 5) * 0.4;
      probDown -= (normalized / 5) * 0.15;
      probFlat -= (normalized / 5) * 0.25;
    } else if (normalized < 0) {
      probDown += (Math.abs(normalized) / 5) * 0.4;
      probUp -= (Math.abs(normalized) / 5) * 0.15;
      probFlat -= (Math.abs(normalized) / 5) * 0.25;
    }

    const direction = probUp > 0.55 ? 'PROBABLE UPWARD' : 
                      probDown > 0.55 ? 'PROBABLE DOWNWARD' : 'NEUTRAL / RANGE';

    const result = {
      security: security,
      timestamp: new Date().toISOString(),
      forecast: direction,
      probabilities: {
        up: parseFloat(probUp.toFixed(3)),
        down: parseFloat(probDown.toFixed(3)),
        flat: parseFloat(probFlat.toFixed(3))
      },
      evidence: {
        rsi: latest.rsi14.toFixed(2),
        macdHistogram: latest.macdHist.toFixed(2),
        trendSMA50: latest.close > latest.sma50 ? 'ABOVE' : 'BELOW',
        distanceSMA20: (latest.distSma20 * 100).toFixed(2) + '%'
      }
    };

    console.log(`[ForecastingEngine] Result for ${symbol}:`, result);
    return result;
  }
}

export const forecastingEngine = new ForecastingEngine();
