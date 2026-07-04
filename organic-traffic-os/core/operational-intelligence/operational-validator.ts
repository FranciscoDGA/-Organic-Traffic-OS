import { OperationalMetrics, CostAnalysis, Bottleneck, OptimizationRecommendation } from './operational.types';

export function validateOperationalReport(metrics: OperationalMetrics, costs: CostAnalysis): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (metrics.operational_score < 0 || metrics.operational_score > 100) errors.push('invalid operational_score');
  if (costs.total_cost < 0) errors.push('invalid total_cost');
  if (costs.potential_savings < 0) errors.push('invalid potential_savings');
  return { valid: errors.length === 0, errors };
}
