import { MissionSupervision } from './strategic.types';

export function prioritizeMissions(supervisions: MissionSupervision[]): MissionSupervision[] {
  return [...supervisions].sort((a, b) => {
    const scoreA = a.score.overallStrategicScore * 0.4 + (100 - a.score.operationalRisk) * 0.3 + a.score.executionHealth * 0.3;
    const scoreB = b.score.overallStrategicScore * 0.4 + (100 - b.score.operationalRisk) * 0.3 + b.score.executionHealth * 0.3;
    return scoreB - scoreA;
  });
}

export function getHighRiskMissions(supervisions: MissionSupervision[]): MissionSupervision[] {
  return supervisions.filter(s => s.score.operationalRisk > 50 || s.score.missionHealth < 50);
}
