import { Opportunity } from './opportunity.types';

export function scoreOpportunity(opp: Opportunity): number {
  return opp.scores.finalPriorityScore;
}

export function rankOpportunities(opps: Opportunity[]): Opportunity[] {
  return [...opps].sort((a, b) => b.scores.finalPriorityScore - a.scores.finalPriorityScore);
}
