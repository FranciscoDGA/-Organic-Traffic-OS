export type MilestoneStatus = 'pending' | 'in-progress' | 'completed' | 'delayed' | 'skipped';
export type TrendDirection = 'up' | 'down' | 'stable';
export type AlertLevel = 'critical' | 'warning' | 'info';

export interface MissionKPI {
  id: string;
  workspaceId: string;
  missionId: string;
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  progress: number;
  trend: TrendDirection;
  confidence: number;
  lastUpdated: string;
}

export interface Milestone {
  id: string;
  missionId: string;
  name: string;
  description: string;
  deadline: string;
  status: MilestoneStatus;
  progress: number;
  dependencies: string[];
  assignee: string;
}

export interface ProgressScores {
  missionProgressScore: number;
  kpiAchievementScore: number;
  milestoneCompletionScore: number;
  executionVelocity: number;
  delayRiskScore: number;
  successProbability: number;
  overallMissionScore: number;
}

export interface ProgressAlert {
  id: string;
  missionId: string;
  level: AlertLevel;
  type: string;
  message: string;
  timestamp: string;
}

export interface MissionProgressData {
  missionId: string;
  workspaceId: string;
  name: string;
  scores: ProgressScores;
  kpis: MissionKPI[];
  milestones: Milestone[];
  alerts: ProgressAlert[];
  forecast: { estimatedCompletion: string; confidence: number };
  velocity: { tasksPerDay: number; trend: TrendDirection };
}
