import { EnvironmentalEvent } from './environment.types';

export function detectChanges(events: EnvironmentalEvent[]): { type: string; count: number; avgImpact: number }[] {
  const map = new Map<string, { count: number; totalImpact: number }>();
  events.forEach(e => {
    const existing = map.get(e.type) || { count: 0, totalImpact: 0 };
    map.set(e.type, { count: existing.count + 1, totalImpact: existing.totalImpact + e.impactScore });
  });
  return Array.from(map.entries()).map(([type, data]) => ({
    type,
    count: data.count,
    avgImpact: Math.round(data.totalImpact / data.count),
  }));
}
