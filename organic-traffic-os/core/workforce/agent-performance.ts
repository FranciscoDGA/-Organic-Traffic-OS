import { AgentProfile, AgentPerformance } from './workforce.types';

const performanceHistory: Map<string, AgentPerformance[]> = new Map();

export function calculatePerformance(agent: AgentProfile): AgentPerformance {
  const total = agent.tasks_completed + agent.tasks_failed;
  return {
    agent_id: agent.id,
    success_rate: total > 0 ? Math.round((agent.tasks_completed / total) * 100) : 0,
    avg_time: agent.avg_execution_time,
    reliability: agent.reliability,
    rework_rate: total > 0 ? Math.round((agent.tasks_failed / total) * 100) : 0,
    ai_consumption: agent.cost_estimate * agent.tasks_completed,
    token_consumption: agent.tasks_completed * 500,
    efficiency: Math.round((agent.reliability * 0.4 + agent.quality_score * 0.4 + (100 - (total > 0 ? Math.round((agent.tasks_failed / total) * 100) : 0)) * 0.2)),
    quality_score: agent.quality_score,
  };
}

export function getPerformanceHistory(agentId: string) { return performanceHistory.get(agentId) || []; }
