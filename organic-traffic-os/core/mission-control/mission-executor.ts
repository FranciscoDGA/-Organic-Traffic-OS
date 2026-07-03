import { Mission, MissionTask } from './mission.types';

export function startMission(mission: Mission): Mission {
  mission.status = 'active';
  mission.history.push({ action: 'started', timestamp: new Date().toISOString(), details: 'Missao iniciada' });
  mission.updatedAt = new Date().toISOString();
  return mission;
}

export function pauseMission(mission: Mission): Mission {
  mission.status = 'paused';
  mission.history.push({ action: 'paused', timestamp: new Date().toISOString(), details: 'Missao pausada' });
  mission.updatedAt = new Date().toISOString();
  return mission;
}

export function resumeMission(mission: Mission): Mission {
  mission.status = 'active';
  mission.history.push({ action: 'resumed', timestamp: new Date().toISOString(), details: 'Missao retomada' });
  mission.updatedAt = new Date().toISOString();
  return mission;
}

export function cancelMission(mission: Mission): Mission {
  mission.status = 'cancelled';
  mission.history.push({ action: 'cancelled', timestamp: new Date().toISOString(), details: 'Missao cancelada' });
  mission.updatedAt = new Date().toISOString();
  return mission;
}

export function completeMission(mission: Mission): Mission {
  mission.status = 'completed';
  mission.progress = 100;
  mission.history.push({ action: 'completed', timestamp: new Date().toISOString(), details: 'Missao concluida' });
  mission.updatedAt = new Date().toISOString();
  return mission;
}

export function updateTaskProgress(mission: Mission, taskId: string, progress: number, result?: string): Mission {
  const task = mission.tasks.find(t => t.id === taskId);
  if (task) {
    task.progress = progress;
    task.status = progress >= 100 ? 'completed' : progress > 0 ? 'running' : 'pending';
    if (result) task.result = result;
    task.updatedAt = new Date().toISOString();
    mission.progress = Math.round(mission.tasks.reduce((s, t) => s + t.progress, 0) / mission.tasks.length);
    mission.updatedAt = new Date().toISOString();
  }
  return mission;
}
