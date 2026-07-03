import { MissionPriority, MissionObjective, Workspace } from './mission-planner.types';

export class PriorityEngine {
  evaluate(objective: MissionObjective, workspace: Workspace): MissionPriority {
    if (objective.estimatedTraffic && objective.estimatedTraffic > 10000) return 'urgent';
    if (objective.estimatedTraffic && objective.estimatedTraffic > 5000) return 'high';
    if (workspace.type === 'news') return 'high';
    if (objective.contentType?.includes('campanha')) return 'high';
    if (objective.contentType?.includes('newsletter')) return 'normal';
    return 'normal';
  }

  getPriorityWeight(priority: MissionPriority): number {
    const weights: Record<MissionPriority, number> = { urgent: 5, high: 4, normal: 3, low: 2, background: 1 };
    return weights[priority];
  }
}
