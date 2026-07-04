export interface APICAgent {
  id: string;
  name: string;
  type: string;
  status: string;
  performance: number;
  tasks_completed: number;
  created_at: string;
}

const agents: APICAgent[] = [
  { id: 'agent-001', name: 'Research Agent', type: 'research', status: 'active', performance: 85, tasks_completed: 120, created_at: '2026-06-01' },
  { id: 'agent-002', name: 'Writer Agent', type: 'writing', status: 'active', performance: 78, tasks_completed: 95, created_at: '2026-06-01' },
  { id: 'agent-003', name: 'Monitor Agent', type: 'monitoring', status: 'active', performance: 92, tasks_completed: 200, created_at: '2026-06-01' },
  { id: 'agent-004', name: 'Publishing Agent', type: 'publishing', status: 'active', performance: 88, tasks_completed: 80, created_at: '2026-06-01' },
  { id: 'agent-005', name: 'Discovery Agent', type: 'discovery', status: 'active', performance: 75, tasks_completed: 60, created_at: '2026-06-01' },
  { id: 'agent-006', name: 'Fact Agent', type: 'fact', status: 'active', performance: 90, tasks_completed: 150, created_at: '2026-06-01' },
  { id: 'agent-007', name: 'Planning Agent', type: 'planning', status: 'active', performance: 82, tasks_completed: 70, created_at: '2026-06-01' },
  { id: 'agent-008', name: 'Review Agent', type: 'review', status: 'active', performance: 87, tasks_completed: 110, created_at: '2026-06-01' },
];

export class APICService {
  getAgents(): APICAgent[] { return agents; }
  getAgent(id: string): APICAgent | undefined { return agents.find(a => a.id === id); }
  getPerformance(): Record<string, any> { return { total: agents.length, avg_performance: 85, total_tasks: agents.reduce((s, a) => s + a.tasks_completed, 0) }; }
  getRecommendations(agentId?: string): any[] { return [{ type: 'optimize', agent_id: agentId || 'all', message: 'Consider increasing batch size for better throughput' }]; }
}

let instance: APICService | null = null;
export function getAPICService(): APICService {
  if (!instance) instance = new APICService();
  return instance;
}
