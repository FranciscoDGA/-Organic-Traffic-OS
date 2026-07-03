export type MissionType = 'growth' | 'blog-launch' | 'cluster-expansion' | 'bulk-update' | 'traffic-recovery' | 'thematic-authority' | 'ai-optimization' | 'content-migration' | 'full-audit';
export type MissionStatus = 'draft' | 'planned' | 'active' | 'paused' | 'completed' | 'failed' | 'cancelled';
export type TaskStatus = 'pending' | 'queued' | 'running' | 'completed' | 'failed' | 'skipped';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface MissionTask {
  id: string;
  missionId: string;
  workflowId?: string;
  type: string;
  priority: TaskPriority;
  dependencies: string[];
  status: TaskStatus;
  assignee: string;
  progress: number;
  result?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Mission {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  objective: string;
  type: MissionType;
  priority: TaskPriority;
  status: MissionStatus;
  owner: string;
  strategy: string;
  expectedResult: string;
  deadline: string;
  progress: number;
  tasks: MissionTask[];
  estimatedDuration: number;
  estimatedCost: number;
  history: { action: string; timestamp: string; details: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface MissionPlan {
  missionId: string;
  tasks: MissionTask[];
  estimatedDuration: number;
  estimatedCost: number;
  criticalPath: string[];
}
