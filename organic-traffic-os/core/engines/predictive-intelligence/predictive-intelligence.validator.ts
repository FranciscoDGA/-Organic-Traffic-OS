import { HistoricalDataPoint, ContentHistory, PredictionScores } from './predictive-intelligence.types';

export function validateAnalysisInput(input: any): { valid: boolean; error?: string } {
  if (!input || typeof input !== 'object') return { valid: false, error: 'Input must be an object' };
  return { valid: true };
}

export function calculateTrend(dataPoints: number[]): { slope: number; direction: 'up' | 'down' | 'stable'; strength: number } {
  if (dataPoints.length < 2) return { slope: 0, direction: 'stable', strength: 0 };

  const n = dataPoints.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += dataPoints[i];
    sumXY += i * dataPoints[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const avg = sumY / n;
  const variance = dataPoints.reduce((sum, v) => sum + (v - avg) ** 2, 0) / n;
  const strength = variance > 0 ? Math.min(1, Math.abs(slope) / (Math.sqrt(variance) + 0.01)) : 0;

  const direction = slope > 0.5 ? 'up' : slope < -0.5 ? 'down' : 'stable';
  return { slope, direction, strength: Math.round(strength * 100) };
}

export function predictTraffic(current: number, trend: { slope: number; direction: string }, days: number): number {
  const dailyGrowth = trend.slope;
  const predicted = current + dailyGrowth * days;
  return Math.max(0, Math.round(predicted));
}

export function predictPosition(currentPosition: number, trend: { slope: number; direction: string }, days: number): number {
  const dailyChange = -trend.slope * 0.1;
  const predicted = currentPosition + dailyChange * days;
  return Math.max(1, Math.round(predicted * 10) / 10);
}

export function predictGrowthRate(dataPoints: number[]): number {
  if (dataPoints.length < 2) return 0;
  const firstHalf = dataPoints.slice(0, Math.floor(dataPoints.length / 2));
  const secondHalf = dataPoints.slice(Math.floor(dataPoints.length / 2));
  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  return avgFirst > 0 ? Math.round(((avgSecond - avgFirst) / avgFirst) * 100) : 0;
}

export function calculateRefreshProbability(history: ContentHistory): number {
  let prob = 0;

  const lastUpdate = history.lastUpdate || history.pubDate;
  const ageDays = (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays > 365) prob += 40;
  else if (ageDays > 180) prob += 25;
  else if (ageDays > 90) prob += 10;

  const clicks = history.data_points.map(d => d.clicks);
  const trend = calculateTrend(clicks);
  if (trend.direction === 'down' && trend.strength > 30) prob += 30;
  else if (trend.direction === 'down') prob += 15;

  const positions = history.data_points.map(d => d.position);
  const posTrend = calculateTrend(positions);
  if (posTrend.direction === 'up' && posTrend.strength > 30) prob += 20;

  return Math.min(100, prob);
}

export function calculateContentLongevity(history: ContentHistory): number {
  let score = 50;

  const lastUpdate = history.lastUpdate || history.pubDate;
  const ageDays = (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays < 90) score += 20;
  else if (ageDays < 180) score += 10;
  else if (ageDays > 365) score -= 20;

  const clicks = history.data_points.map(d => d.clicks);
  const trend = calculateTrend(clicks);
  if (trend.direction === 'up') score += 15;
  else if (trend.direction === 'down') score -= 15;

  if (history.word_count > 1500) score += 10;
  else if (history.word_count < 500) score -= 10;

  if (history.internal_links_in > 5) score += 5;
  else if (history.internal_links_in === 0) score -= 5;

  return Math.max(0, Math.min(100, score));
}

export function calculateConfidence(dataPoints: number): number {
  if (dataPoints >= 30) return 85;
  if (dataPoints >= 20) return 75;
  if (dataPoints >= 14) return 65;
  if (dataPoints >= 7) return 50;
  if (dataPoints >= 3) return 35;
  return 20;
}

export function calculateStrategicValue(history: ContentHistory, growthRate: number, risk: number): number {
  let score = 30;

  if (growthRate > 20) score += 25;
  else if (growthRate > 5) score += 15;
  else if (growthRate < -10) score -= 10;

  if (risk < 30) score += 15;
  else if (risk > 60) score -= 10;

  if (history.current_clicks > 100) score += 15;
  else if (history.current_clicks > 20) score += 5;

  if (history.word_count > 1500) score += 10;

  return Math.max(0, Math.min(100, score));
}
