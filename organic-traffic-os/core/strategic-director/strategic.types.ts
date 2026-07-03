export type DecisionType = 'priority-change' | 'defer' | 'create-task' | 'cancel-task' | 'split-mission' | 'merge-missions' | 'strategy-change' | 'request-experiment' | 'request-analysis';
export type DecisionStatus = 'pending' | 'approved' | 'executed' | 'rejected';
export type DecisionPriority = 'critical' | 'high' | 'medium' | 'low';

export interface StrategicDecision {
  id: string;
  workspaceId: string;
  missionId: string;
  type: DecisionType;
  origin: string;
  reason: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  priority: DecisionPriority;
  recommendation: string;
  status: DecisionStatus;
  createdAt: string;
}

export interface StrategicScore {
  missionHealth: number;
  executionHealth: number;
  strategyScore: number;
  priorityScore: number;
  operationalRisk: number;
  expectedSuccess: number;
  overallStrategicScore: number;
}

export interface MissionSupervision {
  missionId: string;
  workspaceId: string;
  name: string;
  status: string;
  progress: number;
  score: StrategicScore;
  deviations: string[];
  recommendations: string[];
  lastAnalyzed: string;
}

export interface StrategicReport {
  id: string;
  supervisedMissions: number;
  activeDecisions: number;
  missionSupervisions: MissionSupervision[];
  recentDecisions: StrategicDecision[];
  overallStrategicScore: number;
  recommendations: string[];
  createdAt: string;
}
