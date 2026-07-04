import { EnvironmentalReport } from './environment.types';

export function validateEnvironmentReport(report: EnvironmentalReport): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (report.totalEvents < 0) errors.push('invalid event count');
  if (report.overallImpactScore < 0 || report.overallImpactScore > 100) errors.push('invalid impact score');
  return { valid: errors.length === 0, errors };
}
