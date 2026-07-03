export type CheckStatus = 'passed' | 'failed' | 'warning' | 'pending' | 'skipped';
export type ReadinessLevel = 'not_ready' | 'partial' | 'ready' | 'excellent';

export interface CheckResult {
  id: string;
  name: string;
  category: string;
  status: CheckStatus;
  score: number;
  maxScore: number;
  details: string;
  durationMs: number;
}

export interface WorkspaceReadiness {
  workspaceId: string;
  workspaceName: string;
  overallScore: number;
  checks: CheckResult[];
  status: ReadinessLevel;
}

export interface AgentReadiness {
  agentName: string;
  permissions: CheckStatus;
  performance: CheckStatus;
  consumption: CheckStatus;
  costs: CheckStatus;
  logs: CheckStatus;
  retries: CheckStatus;
  playbooks: CheckStatus;
  knowledge: CheckStatus;
  integrations: CheckStatus;
  score: number;
}

export interface ReadinessScore {
  infrastructure: number;
  security: number;
  runtime: number;
  publishing: number;
  business: number;
  ai: number;
  workspace: number;
  overall: number;
  level: ReadinessLevel;
}

export interface GoLiveReport {
  id: string;
  overallScore: ReadinessScore;
  workspaces: WorkspaceReadiness[];
  agents: AgentReadiness[];
  pendingItems: string[];
  risks: string[];
  criticalItems: string[];
  blockingItems: string[];
  recommendations: string[];
  goLivePlan: string[];
  rollbackPlan: string[];
  successCriteria: string[];
  authorized: boolean;
  generatedAt: string;
}
