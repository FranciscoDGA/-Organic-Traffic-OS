export type GrowthActionType = 'create_content' | 'update_content' | 'improve_cta' | 'improve_title' | 'improve_meta' | 'add_faq' | 'create_pillar' | 'create_satellite' | 'improve_internal_links' | 'expand_cluster' | 'create_experiment' | 'republish' | 'create_newsletter' | 'create_asset';

export type GrowthActionStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'in_queue' | 'executing' | 'completed' | 'failed';

export type GrowthRisk = 'low' | 'medium' | 'high';

export interface GrowthAction {
  id: string;
  workspaceId: string;
  contentId?: string;
  type: GrowthActionType;
  title: string;
  description: string;
  expectedImpact: number;
  effort: number;
  priority: number;
  confidence: number;
  risk: GrowthRisk;
  dependencies: string[];
  status: GrowthActionStatus;
  rejectionReason?: string;
  recommendedWorkflow?: string;
  origin: string;
  createdAt: string;
  updatedAt: string;
}

export interface GrowthPlan {
  id: string;
  workspaceId: string;
  actions: GrowthAction[];
  totalActions: number;
  approvedActions: number;
  rejectedActions: number;
  pendingActions: number;
  avgPriority: number;
  risks: string[];
  recommendations: string[];
  createdAt: string;
}

export interface PriorityScore {
  impactScore: number;
  effortScore: number;
  confidenceScore: number;
  riskScore: number;
  trafficPotential: number;
  strategicValue: number;
  finalScore: number;
}
