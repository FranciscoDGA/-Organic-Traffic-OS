import { ReliabilityScore } from './reliability.types';

function determineLevel(score: number): ReliabilityScore['level'] {
  if (score >= 95) return 'excellent';
  if (score >= 85) return 'good';
  if (score >= 70) return 'fair';
  return 'poor';
}

export function calculateReliabilityScore(indicators: {
  availability: number; uptime: number; errorRate: number; avgLatencyMs: number; mttr: number;
}): ReliabilityScore {
  const availability = Math.min(100, indicators.availability);
  const performance = Math.max(0, 100 - indicators.errorRate * 10 - Math.min(50, indicators.avgLatencyMs / 10));
  const resilience = Math.max(0, 100 - indicators.mttr / 60);
  const efficiency = Math.max(0, 100 - indicators.errorRate * 5);
  const overall = Math.round(availability * 0.35 + performance * 0.25 + resilience * 0.2 + efficiency * 0.2);
  return { overall, availability: Math.round(availability), performance: Math.round(performance), resilience: Math.round(resilience), efficiency: Math.round(efficiency), level: determineLevel(overall) };
}
