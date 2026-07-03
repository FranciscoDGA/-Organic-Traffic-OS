import { Mission, MissionTask, MissionPlan } from './mission.types';

export function buildExecutionPlan(mission: Mission): MissionPlan {
  const tasks: MissionTask[] = [
    { id: `tsk-${mission.id}-research`, missionId: mission.id, type: 'research', priority: 'high', dependencies: [], status: 'pending', assignee: 'Research Agent', progress: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: `tsk-${mission.id}-writing`, missionId: mission.id, type: 'writing', priority: 'high', dependencies: [`tsk-${mission.id}-research`], status: 'pending', assignee: 'Writer Agent', progress: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: `tsk-${mission.id}-review`, missionId: mission.id, type: 'review', priority: 'medium', dependencies: [`tsk-${mission.id}-writing`], status: 'pending', assignee: 'Review Agent', progress: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: `tsk-${mission.id}-publish`, missionId: mission.id, type: 'publishing', priority: 'medium', dependencies: [`tsk-${mission.id}-review`], status: 'pending', assignee: 'Publishing Agent', progress: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: `tsk-${mission.id}-monitor`, missionId: mission.id, type: 'monitoring', priority: 'low', dependencies: [`tsk-${mission.id}-publish`], status: 'pending', assignee: 'Monitoring Agent', progress: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  return {
    missionId: mission.id,
    tasks,
    estimatedDuration: mission.estimatedDuration || 30,
    estimatedCost: mission.estimatedCost || 15.0,
    criticalPath: tasks.filter(t => t.priority === 'critical' || t.priority === 'high').map(t => t.id),
  };
}

export function prioritizeTasks(tasks: MissionTask[]): MissionTask[] {
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...tasks].sort((a, b) => order[a.priority] - order[b.priority]);
}

export function estimateDuration(mission: Mission): number {
  const base = mission.type === 'full-audit' ? 20 : mission.type === 'blog-launch' ? 15 : mission.type === 'cluster-expansion' ? 45 : 30;
  return base;
}

export function estimateCost(mission: Mission): number {
  const base = mission.type === 'full-audit' ? 10 : mission.type === 'blog-launch' ? 8 : mission.type === 'cluster-expansion' ? 25 : 15;
  return base;
}
