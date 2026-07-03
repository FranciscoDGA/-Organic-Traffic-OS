import { Mission } from './mission.types';

export function getMissionContext(mission: Mission) {
  return {
    missionId: mission.id,
    workspaceId: mission.workspaceId,
    type: mission.type,
    taskCount: mission.tasks.length,
    completedTasks: mission.tasks.filter(t => t.status === 'completed').length,
    failedTasks: mission.tasks.filter(t => t.status === 'failed').length,
    progress: mission.progress,
    status: mission.status,
  };
}
