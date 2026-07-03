import { MissionKPI } from './mission-progress.types';

export function calculateKPIProgress(kpi: MissionKPI): MissionKPI {
  const progress = kpi.targetValue > 0 ? Math.min(100, Math.round((kpi.currentValue / kpi.targetValue) * 100)) : 0;
  return { ...kpi, progress, lastUpdated: new Date().toISOString() };
}

export function updateKPIValue(kpi: MissionKPI, newValue: number): MissionKPI {
  const trend = newValue > kpi.currentValue ? 'up' as const : newValue < kpi.currentValue ? 'down' as const : 'stable' as const;
  return calculateKPIProgress({ ...kpi, currentValue: newValue, trend });
}
