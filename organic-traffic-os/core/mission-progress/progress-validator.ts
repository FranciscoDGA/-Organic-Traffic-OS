import { MissionProgressData } from './mission-progress.types';

export function validateMissionProgress(data: MissionProgressData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data.missionId) errors.push('missionId required');
  if (data.kpis.length === 0) errors.push('at least 1 KPI required');
  if (data.scores.overallMissionScore < 0 || data.scores.overallMissionScore > 100) errors.push('invalid overall score');
  return { valid: errors.length === 0, errors };
}
