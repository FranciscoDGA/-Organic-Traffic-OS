import { GrowthAction, PriorityScore } from './growth.types';

export function calculatePriorityScore(action: GrowthAction): PriorityScore {
  const impactScore = action.expectedImpact;
  const effortScore = 100 - action.effort;
  const confidenceScore = action.confidence * 100;
  const riskScore = action.risk === 'high' ? 30 : action.risk === 'medium' ? 15 : 5;
  const trafficPotential = impactScore * 0.6 + confidenceScore * 0.4;
  const strategicValue = effortScore * 0.5 + confidenceScore * 0.3 + (100 - riskScore) * 0.2;
  const finalScore = impactScore * 0.35 + effortScore * 0.25 + confidenceScore * 0.2 + strategicValue * 0.15 + (100 - riskScore) * 0.1;

  return { impactScore, effortScore, confidenceScore, riskScore, trafficPotential, strategicValue, finalScore: Math.round(finalScore) };
}

export function prioritizeActions(actions: GrowthAction[]): GrowthAction[] {
  return [...actions].sort((a, b) => b.priority - a.priority);
}
