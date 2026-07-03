import { StrategicReport } from './strategic.types';

export function validateStrategicReport(report: StrategicReport): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (report.supervisedMissions < 0) errors.push('invalid mission count');
  if (report.overallStrategicScore < 0 || report.overallStrategicScore > 100) errors.push('invalid strategic score');
  return { valid: errors.length === 0, errors };
}
