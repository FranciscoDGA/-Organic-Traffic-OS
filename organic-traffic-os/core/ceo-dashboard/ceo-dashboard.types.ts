export interface WorkspaceSummary {
  workspaceId: string;
  name: string;
  healthScore: number;
  growthScore: number;
  riskScore: number;
  authorityScore: number;
  operationalScore: number;
  executionScore: number;
  overallScore: number;
  contentCount: number;
  traffic: number;
  cost: number;
  tokensUsed: number;
  workflowsExecuted: number;
  opportunities: number;
  experiments: number;
  status: 'healthy' | 'warning' | 'critical';
}

export interface Alert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  workspaceId?: string;
  origin: string;
  timestamp: string;
}

export interface CEOAction {
  id: string;
  type: 'invest' | 'accelerate' | 'review' | 'reduce' | 'risk' | 'execute';
  title: string;
  description: string;
  workspaceId?: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  origin: string;
}

export interface CostOverview {
  totalCost: number;
  totalTokens: number;
  avgCostPerWorkspace: number;
  workspaces: { workspaceId: string; cost: number; tokens: number }[];
}

export interface ExecutionOverview {
  totalWorkflows: number;
  activeJobs: number;
  pendingActions: number;
  experimentsRunning: number;
  contentInProduction: number;
  contentAtRisk: number;
}

export interface CEOSummary {
  situation: string;
  bestWorkspace: string;
  highestRiskWorkspace: string;
  mostUrgentAction: string;
  biggestOpportunity: string;
  estimatedCost: string;
  mainRecommendation: string;
}

export interface CEODashboardData {
  totalWorkspaces: number;
  activeWorkspaces: number;
  healthScore: number;
  growthScore: number;
  riskScore: number;
  workspaceRanking: WorkspaceSummary[];
  alerts: Alert[];
  prioritizedActions: CEOAction[];
  costOverview: CostOverview;
  executionOverview: ExecutionOverview;
  summary: CEOSummary;
}
