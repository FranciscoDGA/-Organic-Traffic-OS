export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'scheduled' | 'running' | 'completed' | 'blocked';

export interface PriorityTask {
  id: string;
  missionId: string;
  workspaceId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  urgency: number;
  impact: number;
  risk: number;
  dependencies: string[];
  estimatedTime: number;
  estimatedCost: number;
  assignedTo: string;
  createdAt: string;
}

export interface DailyPlan {
  id: string;
  workspaceId: string;
  date: string;
  objectives: string[];
  priorityTasks: PriorityTask[];
  scheduledWorkflows: { id: string; name: string; time: string }[];
  estimatedTime: number;
  estimatedCost: number;
  risks: string[];
  opportunities: string[];
  recommendations: string[];
  createdAt: string;
}

export interface CapacityReport {
  runtimeCapacity: number;
  schedulerCapacity: number;
  agentCapacity: number;
  aiLimit: number;
  dailyBudget: number;
  maxWorkflows: number;
  availableQueues: number;
  utilization: number;
}

export interface ExecutiveSummary {
  topPriorities: string[];
  criticalTasks: string[];
  biggestRisk: string;
  biggestOpportunity: string;
  mostImportantMission: string;
  operationalRecommendation: string;
}
