import { Milestone, MilestoneStatus } from './mission-progress.types';

export function updateMilestoneStatus(milestone: Milestone, status: MilestoneStatus): Milestone {
  return { ...milestone, status, progress: status === 'completed' ? 100 : milestone.progress };
}

export function getOverdueMilestones(milestones: Milestone[]): Milestone[] {
  const now = new Date();
  return milestones.filter(m => m.status !== 'completed' && m.status !== 'skipped' && new Date(m.deadline) < now);
}

export function getMilestoneProgress(milestones: Milestone[]): number {
  if (milestones.length === 0) return 0;
  return Math.round(milestones.reduce((s, m) => s + m.progress, 0) / milestones.length);
}
