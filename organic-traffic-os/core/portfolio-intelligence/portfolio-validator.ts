import { PortfolioReport } from './portfolio.types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePortfolioReport(report: PortfolioReport): ValidationResult {
  const errors: string[] = [];
  if (report.workspaceCount < 1) errors.push('at least 1 workspace required');
  if (report.portfolioScore.overallPortfolioScore < 0 || report.portfolioScore.overallPortfolioScore > 100) errors.push('invalid portfolio score');
  return { valid: errors.length === 0, errors };
}
