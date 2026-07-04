import { EnvironmentalEvent, TrendData } from './environment.types';

export function correlateTrends(events: EnvironmentalEvent[]): TrendData[] {
  const trends: TrendData[] = [];
  events.filter(e => e.type === 'trending-topic' || e.type === 'new-topic').forEach(e => {
    trends.push({ topic: e.title, strength: e.impactScore, direction: 'up' as const, volume: e.urgencyScore * 100, source: e.source });
  });
  events.filter(e => e.type === 'interest-decline').forEach(e => {
    trends.push({ topic: e.title, strength: e.impactScore, direction: 'down' as const, volume: e.urgencyScore * 80, source: e.source });
  });
  events.filter(e => e.type === 'seasonality').forEach(e => {
    trends.push({ topic: e.title, strength: e.impactScore, direction: 'stable' as const, volume: e.urgencyScore * 120, source: e.source });
  });
  return trends;
}
