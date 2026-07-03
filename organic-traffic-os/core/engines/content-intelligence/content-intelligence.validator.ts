import { ContentItem, ContentMetrics } from './content-intelligence.types';

export function validateAnalysisInput(input: any): { valid: boolean; error?: string } {
  if (!input || typeof input !== 'object') return { valid: false, error: 'Input must be an object' };
  return { valid: true };
}

export function calculateHealthScore(metrics: ContentMetrics, ageDays: number): number {
  let score = 50;

  if (metrics.clicks > 100) score += 10;
  else if (metrics.clicks > 10) score += 5;
  else if (metrics.clicks === 0) score -= 10;

  if (metrics.ctr > 5) score += 10;
  else if (metrics.ctr > 2) score += 5;
  else if (metrics.ctr < 0.5) score -= 10;

  if (metrics.position <= 3) score += 15;
  else if (metrics.position <= 10) score += 10;
  else if (metrics.position <= 20) score += 5;
  else if (metrics.position > 50) score -= 10;

  if (metrics.bounce_rate < 40) score += 10;
  else if (metrics.bounce_rate > 80) score -= 10;

  if (metrics.avg_time_on_page > 120) score += 5;
  else if (metrics.avg_time_on_page < 30) score -= 5;

  if (ageDays < 30) score += 5;
  else if (ageDays > 365) score -= 5;

  return Math.max(0, Math.min(100, score));
}

export function calculateOpportunityScore(metrics: ContentMetrics): number {
  let score = 0;

  if (metrics.impressions > 1000 && metrics.position > 10) score += 30;
  else if (metrics.impressions > 500 && metrics.position > 20) score += 20;

  if (metrics.ctr < 2 && metrics.impressions > 100) score += 25;
  else if (metrics.ctr < 1 && metrics.impressions > 50) score += 15;

  if (metrics.position > 5 && metrics.position <= 20) score += 20;
  else if (metrics.position > 20 && metrics.position <= 50) score += 15;

  if (metrics.clicks > 0 && metrics.clicks < 50) score += 15;

  return Math.max(0, Math.min(100, score));
}

export function calculateRiskScore(metrics: ContentMetrics, ageDays: number): number {
  let score = 0;

  if (metrics.clicks > 50 && metrics.position > 10) score += 30;
  else if (metrics.clicks > 20 && metrics.position > 20) score += 20;

  if (ageDays > 365) score += 20;
  else if (ageDays > 180) score += 10;

  if (metrics.ctr < 1 && metrics.impressions > 100) score += 15;

  if (metrics.bounce_rate > 70) score += 15;

  return Math.max(0, Math.min(100, score));
}

export function calculateFreshnessScore(updatedDate?: string, pubDate?: string): number {
  const date = updatedDate || pubDate;
  if (!date) return 30;

  const ageMs = Date.now() - new Date(date).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  if (ageDays < 7) return 100;
  if (ageDays < 30) return 85;
  if (ageDays < 90) return 70;
  if (ageDays < 180) return 50;
  if (ageDays < 365) return 30;
  return 10;
}

export function calculateAuthorityScore(metrics: ContentMetrics): number {
  let score = 30;

  if (metrics.clicks > 200) score += 30;
  else if (metrics.clicks > 50) score += 20;
  else if (metrics.clicks > 10) score += 10;

  if (metrics.position <= 3) score += 20;
  else if (metrics.position <= 10) score += 10;

  if (metrics.sessions > 100) score += 10;
  else if (metrics.sessions > 20) score += 5;

  return Math.max(0, Math.min(100, score));
}

export function calculatePotentialScore(metrics: ContentMetrics): number {
  let score = 0;

  if (metrics.impressions > 5000) score += 40;
  else if (metrics.impressions > 1000) score += 30;
  else if (metrics.impressions > 100) score += 20;

  if (metrics.position > 10 && metrics.position <= 30) score += 25;
  else if (metrics.position > 30) score += 15;

  if (metrics.ctr < 2) score += 20;

  return Math.max(0, Math.min(100, score));
}

export function calculateGrowthScore(current: ContentMetrics, previous?: ContentMetrics): number {
  if (!previous) return 50;

  const clickGrowth = previous.clicks > 0 ? ((current.clicks - previous.clicks) / previous.clicks) * 100 : 0;
  const impressionGrowth = previous.impressions > 0 ? ((current.impressions - previous.impressions) / previous.impressions) * 100 : 0;
  const positionChange = previous.position - current.position;

  let score = 50;
  if (clickGrowth > 20) score += 20;
  else if (clickGrowth > 5) score += 10;
  else if (clickGrowth < -20) score -= 20;
  else if (clickGrowth < -5) score -= 10;

  if (impressionGrowth > 20) score += 15;
  else if (impressionGrowth < -20) score -= 15;

  if (positionChange > 5) score += 15;
  else if (positionChange < -5) score -= 15;

  return Math.max(0, Math.min(100, score));
}
