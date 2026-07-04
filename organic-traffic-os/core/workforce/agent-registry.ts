import { AgentProfile } from './workforce.types';

const agents: AgentProfile[] = [
  { id: 'agent-001', workspace_id: 'passacumaru', name: 'Research Agent', specialty: 'research', capabilities: ['keyword-research', 'competitor-analysis', 'trend-detection'], status: 'available', availability: 100, current_load: 0, max_load: 10, priority: 80, reliability: 92, quality_score: 85, cost_estimate: 0.02, tasks_completed: 45, tasks_failed: 3, avg_execution_time: 120 },
  { id: 'agent-002', workspace_id: 'passacumaru', name: 'Writer Agent', specialty: 'writing', capabilities: ['content-creation', 'seo-optimization', 'editing'], status: 'available', availability: 80, current_load: 2, max_load: 5, priority: 90, reliability: 88, quality_score: 82, cost_estimate: 0.05, tasks_completed: 38, tasks_failed: 5, avg_execution_time: 300 },
  { id: 'agent-003', workspace_id: 'passacumaru', name: 'Monitor Agent', specialty: 'monitoring', capabilities: ['performance-tracking', 'alert-generation', 'reporting'], status: 'available', availability: 100, current_load: 0, max_load: 20, priority: 70, reliability: 95, quality_score: 90, cost_estimate: 0.01, tasks_completed: 120, tasks_failed: 2, avg_execution_time: 30 },
  { id: 'agent-004', workspace_id: 'passacumaru', name: 'Publishing Agent', specialty: 'publishing', capabilities: ['wordpress-publishing', 'social-media', 'newsletter'], status: 'available', availability: 60, current_load: 1, max_load: 3, priority: 85, reliability: 90, quality_score: 88, cost_estimate: 0.03, tasks_completed: 25, tasks_failed: 1, avg_execution_time: 60 },
  { id: 'agent-005', workspace_id: 'garimpeibrasil', name: 'Discovery Agent', specialty: 'discovery', capabilities: ['opportunity-detection', 'trend-analysis', 'market-research'], status: 'available', availability: 90, current_load: 1, max_load: 8, priority: 75, reliability: 87, quality_score: 80, cost_estimate: 0.02, tasks_completed: 30, tasks_failed: 4, avg_execution_time: 150 },
  { id: 'agent-006', workspace_id: 'garimpeibrasil', name: 'Fact Agent', specialty: 'fact-checking', capabilities: ['fact-verification', 'source-validation', 'conflict-detection'], status: 'available', availability: 95, current_load: 0, max_load: 15, priority: 65, reliability: 93, quality_score: 91, cost_estimate: 0.01, tasks_completed: 80, tasks_failed: 1, avg_execution_time: 45 },
];

export function getAllAgents() { return agents; }
export function getAgentById(id: string) { return agents.find(a => a.id === id); }
export function getAgentsByWorkspace(workspaceId: string) { return agents.filter(a => !a.workspace_id || a.workspace_id === workspaceId); }
export function getAvailableAgents() { return agents.filter(a => a.status === 'available' && a.current_load < a.max_load); }
