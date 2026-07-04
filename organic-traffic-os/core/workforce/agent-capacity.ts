import { AgentProfile } from './workforce.types';

export function getAgentCapacity(agent: AgentProfile): { loadPercent: number; availableSlots: number; status: string } {
  const loadPercent = Math.round((agent.current_load / agent.max_load) * 100);
  const availableSlots = agent.max_load - agent.current_load;
  const status = loadPercent >= 100 ? 'full' : loadPercent >= 70 ? 'high' : loadPercent >= 30 ? 'moderate' : 'low';
  return { loadPercent, availableSlots, status };
}

export function canAcceptTask(agent: AgentProfile): boolean {
  return agent.status === 'available' && agent.current_load < agent.max_load && agent.availability > 0;
}

export function updateAgentLoad(agentId: string, delta: number): void {
  // In real implementation, would update agent load
}
