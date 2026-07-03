import { WorkspaceMetrics } from './portfolio.types';

export function compareWorkspaces(workspaces: WorkspaceMetrics[]): { metric: string; winner: string; values: { workspaceId: string; value: number }[] }[] {
  const metrics = [
    { key: 'traffic' as const, label: 'Trafego' },
    { key: 'authority' as const, label: 'Autoridade' },
    { key: 'growth' as const, label: 'Crescimento' },
    { key: 'contentCount' as const, label: 'Conteudo' },
    { key: 'experiments' as const, label: 'Experimentos' },
    { key: 'workflowsExecuted' as const, label: 'Workflows' },
    { key: 'publishingFrequency' as const, label: 'Frequencia' },
  ];

  return metrics.map(({ key, label }) => {
    const values = workspaces.map(w => ({ workspaceId: w.workspaceId, value: w[key] }));
    values.sort((a, b) => b.value - a.value);
    return { metric: label, winner: values[0]?.workspaceId || '', values };
  });
}
