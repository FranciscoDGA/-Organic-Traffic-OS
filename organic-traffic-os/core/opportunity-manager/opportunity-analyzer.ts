import { Opportunity, OpportunityScores } from './opportunity.types';

export function analyzeOpportunity(opp: Opportunity): OpportunityScores {
  const impactScore = opp.estimatedImpact;
  const effortScore = Math.max(0, 100 - opp.estimatedEffort);
  const strategicValue = Math.round(impactScore * 0.4 + opp.confidence * 100 * 0.3 + effortScore * 0.3);
  const revenuePotential = Math.round(impactScore * 0.5 + (100 - opp.risk) * 0.3 + effortScore * 0.2);
  const aiVisibilityPotential = Math.round(opp.estimatedImpact * 0.6 + opp.confidence * 100 * 0.4);
  const organicGrowthPotential = Math.round(impactScore * 0.5 + effortScore * 0.3 + (100 - opp.risk) * 0.2);
  const opportunityScore = Math.round(strategicValue * 0.3 + revenuePotential * 0.2 + aiVisibilityPotential * 0.25 + organicGrowthPotential * 0.25);
  const finalPriorityScore = Math.round(opportunityScore * 0.4 + strategicValue * 0.3 + (100 - opp.risk) * 0.15 + opp.confidence * 100 * 0.15);

  return { opportunityScore, impactScore, effortScore, strategicValue, revenuePotential, aiVisibilityPotential, organicGrowthPotential, finalPriorityScore };
}
