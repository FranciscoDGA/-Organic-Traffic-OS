export type AgentStatus = 'available' | 'busy' | 'paused' | 'maintenance' | 'unavailable' | 'error';

export interface AgentProfile {
  id: string;
  workspace_id?: string;
  name: string;
  specialty: string;
  capabilities: string[];
  status: AgentStatus;
  availability: number;
  current_load: number;
  max_load: number;
  priority: number;
  reliability: number;
  quality_score: number;
  cost_estimate: number;
  tasks_completed: number;
  tasks_failed: number;
  avg_execution_time: number;
}

export interface AgentPerformance {
  agent_id: string;
  success_rate: number;
  avg_time: number;
  reliability: number;
  rework_rate: number;
  ai_consumption: number;
  token_consumption: number;
  efficiency: number;
  quality_score: number;
}

export interface TaskAssignment {
  id: string;
  task_id: string;
  agent_id: string;
  workspace_id: string;
  assigned_at: string;
  completed_at?: string;
  status: 'assigned' | 'in-progress' | 'completed' | 'failed';
  duration?: number;
}
