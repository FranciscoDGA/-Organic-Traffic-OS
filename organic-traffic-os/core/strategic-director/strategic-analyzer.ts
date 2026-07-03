import { MissionSupervision, StrategicScore } from './strategic.types';

function calculateScore(m: { progress: number; status: string; tasks?: { status: string }[] }): StrategicScore {
  const taskCount = m.tasks?.length || 1;
  const completedTasks = m.tasks?.filter(t => t.status === 'completed').length || 0;
  const executionHealth = Math.round((completedTasks / taskCount) * 100);
  const missionHealth = m.status === 'active' ? Math.min(100, m.progress + 20) : m.status === 'completed' ? 100 : m.status === 'failed' ? 10 : 50;
  const strategyScore = Math.round(missionHealth * 0.4 + executionHealth * 0.3 + (100 - Math.abs(m.progress - executionHealth)) * 0.3);
  const priorityScore = m.progress < 30 ? 80 : m.progress < 70 ? 60 : 40;
  const operationalRisk = Math.max(0, 100 - executionHealth - missionHealth * 0.3);
  const expectedSuccess = Math.round(missionHealth * 0.5 + executionHealth * 0.3 + strategyScore * 0.2);
  const overallStrategicScore = Math.round(missionHealth * 0.25 + executionHealth * 0.25 + strategyScore * 0.2 + expectedSuccess * 0.15 + (100 - operationalRisk) * 0.15);

  return { missionHealth, executionHealth, strategyScore, priorityScore, operationalRisk: Math.round(operationalRisk), expectedSuccess, overallStrategicScore };
}

export function analyzeMission(mission: any): MissionSupervision {
  const score = calculateScore(mission);
  const deviations: string[] = [];
  const recommendations: string[] = [];

  if (score.executionHealth < 50) deviations.push('Execucao abaixo do esperado');
  if (score.operationalRisk > 60) deviations.push('Risco operacional elevado');
  if (mission.progress < 30 && mission.status === 'active') deviations.push('Progresso lento para missao ativa');
  if (score.missionHealth < 50) recommendations.push('Revisar estrategia da missao');
  if (score.executionHealth < 60) recommendations.push('Priorizar tasks pendentes');
  if (score.operationalRisk > 50) recommendations.push('Considerar adiamento ou replanejamento');
  if (recommendations.length === 0) recommendations.push('Missao dentro dos parametros esperados');

  return {
    missionId: mission.id,
    workspaceId: mission.workspaceId,
    name: mission.name,
    status: mission.status,
    progress: mission.progress,
    score,
    deviations,
    recommendations,
    lastAnalyzed: new Date().toISOString(),
  };
}
