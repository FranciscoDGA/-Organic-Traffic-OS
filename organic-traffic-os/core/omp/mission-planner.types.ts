export type MissionPriority = 'urgent' | 'high' | 'normal' | 'low' | 'background';
export type MissionStatus = 'received' | 'planning' | 'planned' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
export type WorkspaceType = 'blog' | 'saas' | 'ecommerce' | 'agency' | 'education' | 'news' | 'portfolio';

export interface Workspace {
  id: string;
  name: string;
  type: WorkspaceType;
  niche: string;
  goals: string[];
  activeCampaigns: string[];
  playbooks: string[];
}

export interface MissionObjective {
  id: string;
  description: string;
  targetKeyword?: string;
  targetAudience?: string;
  contentType?: string;
  estimatedTraffic?: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  workflowId: string;
  requiredAgents: string[];
  requiredWorkers: string[];
  estimatedDurationMinutes: number;
  estimatedCost: number;
  risks: string[];
  bestFor: WorkspaceType[];
}

export interface ResourcePlan {
  agents: string[];
  workers: string[];
  queues: string[];
  estimatedTokens: number;
  estimatedApiCalls: number;
}

export interface ExecutionPlan {
  id: string;
  missionObjective: MissionObjective;
  workspace: Workspace;
  strategy: Strategy;
  workflowId: string;
  priority: MissionPriority;
  resources: ResourcePlan;
  estimatedDurationMinutes: number;
  estimatedCost: number;
  risks: string[];
  status: MissionStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}
