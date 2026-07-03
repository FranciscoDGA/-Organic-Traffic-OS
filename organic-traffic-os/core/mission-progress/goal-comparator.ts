import { MissionKPI, Milestone } from './mission-progress.types';

export function compareGoals(kpis: MissionKPI[], milestones: Milestone[]): { onTrack: boolean; kpisBelowTarget: string[]; milestonesDelayed: string[] } {
  const kpisBelowTarget = kpis.filter(k => k.progress < 70).map(k => k.name);
  const milestonesDelayed = milestones.filter(m => m.status === 'delayed').map(m => m.name);
  return { onTrack: kpisBelowTarget.length === 0 && milestonesDelayed.length === 0, kpisBelowTarget, milestonesDelayed };
}
