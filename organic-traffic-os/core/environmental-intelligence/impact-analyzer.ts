import { EnvironmentalEvent } from './environment.types';

export function analyzeImpact(event: EnvironmentalEvent): { workspaceId: string; impactLevel: string; description: string }[] {
  return event.relatedWorkspaces.map(ws => ({
    workspaceId: ws,
    impactLevel: event.impactScore > 70 ? 'high' : event.impactScore > 40 ? 'medium' : 'low',
    description: `Impacto de ${event.impactScore}% no workspace ${ws}`,
  }));
}
