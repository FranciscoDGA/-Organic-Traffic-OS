import { AgentProfile } from './workforce.types';

export function balanceWorkload(agents: AgentProfile[]): { agent_id: string; suggested_load: number; reason: string }[] {
  return agents.map(agent => {
    const loadPercent = Math.round((agent.current_load / agent.max_load) * 100);
    let suggestedLoad = agent.current_load;
    let reason = 'balanced';
    if (loadPercent > 80) { suggestedLoad = Math.max(0, agent.current_load - 2); reason = 'reduce load'; }
    else if (loadPercent < 30 && agent.status === 'available') { suggestedLoad = Math.min(agent.max_load, agent.current_load + 2); reason = 'increase load'; }
    return { agent_id: agent.id, suggested_load: suggestedLoad, reason };
  });
}
