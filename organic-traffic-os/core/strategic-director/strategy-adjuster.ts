import { StrategicDecision } from './strategic.types';

let decCounter = 0;

export function adjustStrategy(supervision: { missionId: string; workspaceId: string; score: { overallStrategicScore: number; operationalRisk: number; executionHealth: number }; deviations: string[] }): StrategicDecision[] {
  const decisions: StrategicDecision[] = [];
  const now = new Date().toISOString();

  if (supervision.score.operationalRisk > 60) {
    decisions.push({
      id: `dec-${++decCounter}`, workspaceId: supervision.workspaceId, missionId: supervision.missionId,
      type: 'strategy-change', origin: 'Strategic Director', reason: 'Risco operacional elevado detectado',
      impact: 'high', confidence: 0.85, priority: 'high', recommendation: 'Revisar e simplificar estrategia atual',
      status: 'pending', createdAt: now,
    });
  }

  if (supervision.score.executionHealth < 50) {
    decisions.push({
      id: `dec-${++decCounter}`, workspaceId: supervision.workspaceId, missionId: supervision.missionId,
      type: 'priority-change', origin: 'Strategic Director', reason: 'Execucao abaixo do ideal',
      impact: 'medium', confidence: 0.8, priority: 'medium', recommendation: 'Repriorizar tasks pendentes',
      status: 'pending', createdAt: now,
    });
  }

  if (supervision.deviations.length > 2) {
    decisions.push({
      id: `dec-${++decCounter}`, workspaceId: supervision.workspaceId, missionId: supervision.missionId,
      type: 'request-analysis', origin: 'Strategic Director', reason: 'Multiplas divergencias detectadas',
      impact: 'medium', confidence: 0.75, priority: 'medium', recommendation: 'Solicitar analise detalhada da missao',
      status: 'pending', createdAt: now,
    });
  }

  return decisions;
}
