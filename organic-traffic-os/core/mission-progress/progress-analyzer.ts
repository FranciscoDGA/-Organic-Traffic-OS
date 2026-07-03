import { MissionKPI, ProgressScores } from './mission-progress.types';

export function calculateKPIScore(kpis: MissionKPI[]): number {
  if (kpis.length === 0) return 0;
  return Math.round(kpis.reduce((s, k) => s + k.progress, 0) / kpis.length);
}

export function calculateScores(mission: { progress: number; status: string }, kpis: MissionKPI[], milestones: { status: string }[]): ProgressScores {
  const kpiScore = calculateKPIScore(kpis);
  const completed = milestones.filter(m => m.status === 'completed').length;
  const milestoneScore = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 50;
  const missionProgressScore = mission.progress;
  const executionVelocity = mission.status === 'active' ? Math.min(100, mission.progress + 15) : mission.status === 'completed' ? 100 : 30;
  const delayRiskScore = mission.progress < 30 && mission.status === 'active' ? 70 : mission.progress < 60 ? 40 : 20;
  const successProbability = Math.round(missionProgressScore * 0.3 + kpiScore * 0.3 + milestoneScore * 0.2 + executionVelocity * 0.1 + (100 - delayRiskScore) * 0.1);
  const overallMissionScore = Math.round(missionProgressScore * 0.25 + kpiScore * 0.25 + milestoneScore * 0.2 + successProbability * 0.15 + executionVelocity * 0.15);

  return { missionProgressScore, kpiAchievementScore: kpiScore, milestoneCompletionScore: milestoneScore, executionVelocity, delayRiskScore, successProbability, overallMissionScore };
}
