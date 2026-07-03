import { PriorityTask } from './chief.types';

export function balanceWorkload(tasks: PriorityTask[]): { agent: string; taskCount: number; estimatedTime: number }[] {
  const agentMap = new Map<string, { count: number; time: number }>();
  tasks.forEach(t => {
    const agent = t.assignedTo || 'Unassigned';
    const existing = agentMap.get(agent) || { count: 0, time: 0 };
    agentMap.set(agent, { count: existing.count + 1, time: existing.time + t.estimatedTime });
  });

  return Array.from(agentMap.entries()).map(([agent, data]) => ({
    agent,
    taskCount: data.count,
    estimatedTime: data.time,
  }));
}
