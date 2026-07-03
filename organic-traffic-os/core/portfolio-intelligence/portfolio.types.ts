export interface WorkspaceScore {
  workspaceId: string;
  healthScore: number;
  growthScore: number;
  opportunityScore: number;
  riskScore: number;
  authorityScore: number;
  operationalScore: number;
  executionScore: number;
  overallScore: number;
}

export interface PortfolioScore {
  overallHealth: number;
  growthScore: number;
  authorityScore: number;
  trafficScore: number;
  executionScore: number;
  contentQualityScore: number;
  operationalScore: number;
  roiScore: number;
  overallPortfolioScore: number;
}

export interface WorkspaceMetrics {
  workspaceId: string;
  name: string;
  contentCount: number;
  traffic: number;
  authority: number;
  growth: number;
  experiments: number;
  opportunities: number;
  workflowsExecuted: number;
  aiTokensUsed: number;
  costEstimate: number;
  publishingFrequency: number;
}

export interface PortfolioReport {
  id: string;
  workspaceCount: number;
  portfolioScore: PortfolioScore;
  workspaceScores: WorkspaceScore[];
  ranking: { workspaceId: string; score: number; rank: number }[];
  risks: string[];
  recommendations: string[];
  capacity: CapacityReport;
  createdAt: string;
}

export interface CapacityReport {
  totalWorkspaces: number;
  totalContent: number;
  totalWorkflows: number;
  totalTokensUsed: number;
  totalCostEstimate: number;
  capacityRemaining: number;
  bottlenecks: string[];
}

export interface PortfolioRecommendation {
  id: string;
  type: 'invest' | 'accelerate' | 'review' | 'reduce' | 'expand' | 'risk';
  workspaceId?: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
}
