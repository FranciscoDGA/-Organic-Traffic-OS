export { getOpportunityService } from './opportunity.service';
export { detectOpportunities, getOpportunityById, getOpportunitiesByWorkspace } from './opportunity-detector';
export { analyzeOpportunity } from './opportunity-analyzer';
export { scoreOpportunity, rankOpportunities } from './opportunity-scorer';
export { buildMissionProposal } from './mission-proposal-builder';
export { validateOpportunity, validateProposal } from './opportunity-validator';
export type { Opportunity, OpportunityScores, MissionProposal, OpportunityType, OpportunityStatus } from './opportunity.types';
