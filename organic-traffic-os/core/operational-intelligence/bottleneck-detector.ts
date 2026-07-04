import { Bottleneck, BottleneckType, Severity } from './operational.types';

let bottleneckCounter = 0;
function genId(): string { return `bn-${Date.now()}-${++bottleneckCounter}`; }

export function detectBottlenecks(): Bottleneck[] {
  return [
    { id: genId(), type: 'queue-congestion', severity: 'medium', description: 'Fila de workflows com 8 itens pendentes', component: 'scheduler', impact: 35, detected_at: new Date().toISOString() },
    { id: genId(), type: 'token-waste', severity: 'high', description: '145k tokens desperdicados em chamadas redundantes', component: 'execution-intelligence', impact: 55, detected_at: new Date().toISOString() },
    { id: genId(), type: 'redundant-calls', severity: 'medium', description: 'Chamadas duplicadas ao mesmo connector detectadas', component: 'connectors', impact: 30, detected_at: new Date().toISOString() },
    { id: genId(), type: 'overloaded-agent', severity: 'low', description: 'Writer Agent com 80% de carga', component: 'workforce', impact: 20, detected_at: new Date().toISOString() },
    { id: genId(), type: 'low-resource-utilization', severity: 'low', description: 'Scheduler com 15% de capacidade ociosa', component: 'scheduler', impact: 15, detected_at: new Date().toISOString() },
  ];
}
