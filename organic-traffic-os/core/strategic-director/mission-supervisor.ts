import { MissionSupervision, StrategicDecision } from './strategic.types';
import { analyzeMission } from './strategic-analyzer';
import { adjustStrategy } from './strategy-adjuster';
import { prioritizeMissions, getHighRiskMissions } from './priority-manager';

const decisions: StrategicDecision[] = [];

export function superviseMissions(missions: any[]): MissionSupervision[] {
  return missions.map(m => analyzeMission(m));
}

export function runDirectorCycle(missions: any[]): { supervisions: MissionSupervision[]; newDecisions: StrategicDecision[]; highRisk: MissionSupervision[] } {
  const supervisions = superviseMissions(missions);
  const prioritized = prioritizeMissions(supervisions);
  const newDecisions: StrategicDecision[] = [];

  prioritized.forEach(s => {
    const decs = adjustStrategy(s);
    newDecisions.push(...decs);
    decisions.push(...decs);
  });

  const highRisk = getHighRiskMissions(prioritized);
  return { supervisions: prioritized, newDecisions, highRisk };
}

export function getAllDecisions(): StrategicDecision[] { return decisions; }
export function getDecisionsByMission(missionId: string): StrategicDecision[] { return decisions.filter(d => d.missionId === missionId); }
