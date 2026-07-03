import { CapacityReport } from './chief.types';

export function estimateCapacity(): CapacityReport {
  return {
    runtimeCapacity: 80,
    schedulerCapacity: 90,
    agentCapacity: 75,
    aiLimit: 85,
    dailyBudget: 15.0,
    maxWorkflows: 10,
    availableQueues: 3,
    utilization: 65,
  };
}

export function detectBottlenecks(capacity: CapacityReport): string[] {
  const bottlenecks: string[] = [];
  if (capacity.utilization > 80) bottlenecks.push('Runtime proximo do limite');
  if (capacity.aiLimit < 50) bottlenecks.push('Limite de IA baixo');
  if (capacity.dailyBudget < 5) bottlenecks.push('Orcamento diario insuficiente');
  if (capacity.agentCapacity < 50) bottlenecks.push('Agents sobrecarregados');
  return bottlenecks;
}
