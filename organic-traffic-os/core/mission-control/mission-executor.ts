import { Mission, MissionTask } from './mission.types';
import { executeMissionWorkflow, MissionExecutionResult } from './mission-orchestrator';

let lastExecutionResult: MissionExecutionResult | null = null;

export function getLastExecutionResult(): MissionExecutionResult | null {
  return lastExecutionResult;
}

export async function startMission(mission: Mission): Promise<Mission> {
  mission.status = 'active';
  mission.history.push({ action: 'started', timestamp: new Date().toISOString(), details: 'Missao iniciada' });
  mission.updatedAt = new Date().toISOString();

  try {
    const result = await executeMissionWorkflow(mission);
    if (result) {
      lastExecutionResult = result;
      mission.history.push({
        action: 'workflow_executed',
        timestamp: new Date().toISOString(),
        details: `Workflow "${result.workflow_id}" executado: ${result.success ? 'sucesso' : 'falha'} (${result.steps_completed}/${result.steps_total} steps, ${result.duration_ms}ms)`,
      });

      if (!result.success) {
        mission.history.push({
          action: 'workflow_failed',
          timestamp: new Date().toISOString(),
          details: `Workflow falhou: ${result.error || 'erro desconhecido'}`,
        });
      }
    }
  } catch (err: any) {
    mission.history.push({
      action: 'workflow_error',
      timestamp: new Date().toISOString(),
      details: `Erro ao executar workflow: ${err.message}`,
    });
  }

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
