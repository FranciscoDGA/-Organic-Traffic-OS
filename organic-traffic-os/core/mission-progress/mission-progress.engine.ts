import { MissionKPI, Milestone, MissionProgressData, ProgressAlert, AlertLevel } from './mission-progress.types';
import { calculateScores } from './progress-analyzer';
import { calculateKPIProgress } from './kpi-tracker';
import { compareGoals } from './goal-comparator';
import { getOverdueMilestones } from './milestone-manager';

let alertCounter = 0;

function generateAlerts(missionId: string, kpis: MissionKPI[], milestones: Milestone[], scores: { delayRiskScore: number; successProbability: number }): ProgressAlert[] {
  const alerts: ProgressAlert[] = [];
  const now = new Date().toISOString();

  kpis.forEach(k => {
    if (k.progress < 50) alerts.push({ id: `alert-${++alertCounter}`, missionId, level: 'warning', type: 'kpi-below', message: `KPI "${k.name}" abaixo da meta (${k.progress}%)`, timestamp: now });
  });

  const overdue = getOverdueMilestones(milestones);
  overdue.forEach(m => {
    alerts.push({ id: `alert-${++alertCounter}`, missionId, level: 'critical', type: 'milestone-delayed', message: `Milestone "${m.name}" atrasado`, timestamp: now });
  });

  if (scores.delayRiskScore > 60) alerts.push({ id: `alert-${++alertCounter}`, missionId, level: 'critical', type: 'delay-risk', message: `Risco de atraso elevado (${scores.delayRiskScore})`, timestamp: now });
  if (scores.successProbability < 50) alerts.push({ id: `alert-${++alertCounter}`, missionId, level: 'warning', type: 'low-success', message: `Probabilidade de sucesso baixa (${scores.successProbability}%)`, timestamp: now });

  return alerts;
}

export function analyzeMissionProgress(mission: { id: string; workspaceId: string; name: string; progress: number; status: string }, kpis: MissionKPI[], milestones: Milestone[]): MissionProgressData {
  const updatedKPIs = kpis.map(calculateKPIProgress);
  const scores = calculateScores(mission, updatedKPIs, milestones);
  const alerts = generateAlerts(mission.id, updatedKPIs, milestones, scores);
  const comparison = compareGoals(updatedKPIs, milestones);

  const daysLeft = 30;
  const remaining = 100 - mission.progress;
  const velocity = mission.progress / Math.max(1, 30 - daysLeft);
  const estimatedDays = velocity > 0 ? Math.round(remaining / velocity) : 999;

  return {
    missionId: mission.id,
    workspaceId: mission.workspaceId,
    name: mission.name,
    scores,
    kpis: updatedKPIs,
    milestones,
    alerts,
    forecast: { estimatedCompletion: new Date(Date.now() + estimatedDays * 86400000).toISOString().split('T')[0], confidence: Math.min(95, scores.successProbability) },
    velocity: { tasksPerDay: parseFloat(velocity.toFixed(2)), trend: velocity > 1 ? 'up' as const : velocity < 0.5 ? 'down' as const : 'stable' as const },
  };
}
