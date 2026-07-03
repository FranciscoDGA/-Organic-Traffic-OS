import { Opportunity, MissionProposal } from './opportunity.types';

let propCounter = 0;

export function buildMissionProposal(opp: Opportunity): MissionProposal {
  return {
    id: `prop-${++propCounter}`,
    opportunityId: opp.id,
    workspaceId: opp.workspaceId,
    name: opp.suggestedMission,
    objective: `Executar: ${opp.title}`,
    strategy: opp.description,
    type: opp.type,
    priority: opp.scores.finalPriorityScore > 75 ? 'high' : opp.scores.finalPriorityScore > 50 ? 'medium' : 'low',
    expectedResult: `Impacto estimado: ${opp.estimatedImpact}%`,
    estimatedDuration: opp.estimatedEffort > 70 ? 45 : opp.estimatedEffort > 40 ? 30 : 15,
    estimatedCost: parseFloat((opp.estimatedEffort * 0.2).toFixed(2)),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}
