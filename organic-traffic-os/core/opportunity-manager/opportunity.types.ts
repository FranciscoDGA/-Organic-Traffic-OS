export type OpportunityType = 'new-cluster' | 'content-update' | 'authority-expansion' | 'seasonal-content' | 'emerging-trend' | 'ctr-improvement' | 'conversion-improvement' | 'traffic-recovery' | 'ai-optimization' | 'digital-asset' | 'new-newsletter' | 'new-pillar-page';
export type OpportunityStatus = 'detected' | 'analyzed' | 'proposed' | 'approved' | 'rejected' | 'executed';

export interface Opportunity {
  id: string;
  workspaceId: string;
  type: OpportunityType;
  title: string;
  description: string;
  origin: string;
  estimatedImpact: number;
  estimatedEffort: number;
  risk: number;
  confidence: number;
  priority: number;
  suggestedMission: string;
  status: OpportunityStatus;
  scores: OpportunityScores;
  createdAt: string;
}

export interface OpportunityScores {
  opportunityScore: number;
  impactScore: number;
  effortScore: number;
  strategicValue: number;
  revenuePotential: number;
  aiVisibilityPotential: number;
  organicGrowthPotential: number;
  finalPriorityScore: number;
}

export interface MissionProposal {
  id: string;
  opportunityId: string;
  workspaceId: string;
  name: string;
  objective: string;
  strategy: string;
  type: string;
  priority: string;
  expectedResult: string;
  estimatedDuration: number;
  estimatedCost: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
