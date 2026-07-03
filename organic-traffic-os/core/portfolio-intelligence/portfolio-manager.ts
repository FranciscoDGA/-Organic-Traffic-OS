import { WorkspaceMetrics } from './portfolio.types';

const workspaces: WorkspaceMetrics[] = [
  { workspaceId: 'passacumaru', name: 'PassaCumaru', contentCount: 45, traffic: 12500, authority: 72, growth: 15, experiments: 3, opportunities: 8, workflowsExecuted: 120, aiTokensUsed: 250000, costEstimate: 12.5, publishingFrequency: 4 },
  { workspaceId: 'garimpeibrasil', name: 'Garimpei Brasil', contentCount: 22, traffic: 6800, authority: 58, growth: 22, experiments: 1, opportunities: 5, workflowsExecuted: 65, aiTokensUsed: 140000, costEstimate: 7.2, publishingFrequency: 2 },
];

export function getWorkspaceMetrics(): WorkspaceMetrics[] {
  return workspaces;
}

export function getWorkspaceMetricsById(id: string): WorkspaceMetrics | undefined {
  return workspaces.find(w => w.workspaceId === id);
}
