export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed';
export type DayStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface SimulationConfig {
  totalDays: number;
  workspaces: string[];
  mode: 'sandbox' | 'staging';
  autoStart: boolean;
}

export interface DayResult {
  day: number;
  date: string;
  status: DayStatus;
  missionsGenerated: number;
  missionsCompleted: number;
  missionsFailed: number;
  publicationsSimulated: number;
  tokensUsed: number;
  costIncurred: number;
  errors: number;
  retries: number;
  alerts: string[];
  durationMs: number;
  agentsUsed: string[];
  workflowsExecuted: string[];
}

export interface SimulationResult {
  id: string;
  config: SimulationConfig;
  status: SimulationStatus;
  days: DayResult[];
  startedAt?: string;
  completedAt?: string;
  totalDaysCompleted: number;
  totalMissions: number;
  totalCompleted: number;
  totalFailed: number;
  totalPublications: number;
  totalTokens: number;
  totalCost: number;
  totalErrors: number;
  totalRetries: number;
  avgDayDurationMs: number;
  availability: number;
  reliability: number;
}

export interface AutonomousReport {
  simulationId: string;
  status: SimulationStatus;
  totalDays: number;
  availability: number;
  reliability: number;
  performance: { avgDayMs: number; totalMissions: number; completionRate: string };
  consumption: { totalTokens: number; totalCost: number; avgCostPerDay: number };
  problems: string[];
  suggestions: string[];
  criticalModules: string[];
  generatedAt: string;
}
