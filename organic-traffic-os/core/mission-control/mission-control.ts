import { getAllMissions, getMissionsByWorkspace, getMissionById, createMission, createMissionWithTasks, updateMission } from './mission-manager';
import { buildExecutionPlan, prioritizeTasks, estimateDuration, estimateCost } from './mission-planner';
import { startMission, pauseMission, resumeMission, cancelMission, completeMission, updateTaskProgress, getLastExecutionResult } from './mission-executor';
import { validateMission } from './mission-validator';
import { getMissionContext } from './mission-context';
import { executeMissionWorkflow, getWorkflowForMission, getMissionOrchestrator } from './mission-orchestrator';
import { Mission, MissionPlan } from './mission.types';

export function getMissionControlService() {
  return {
    getAll: getAllMissions,
    getByWorkspace: getMissionsByWorkspace,
    getById: getMissionById,
    create: createMission,
    createWithTasks: createMissionWithTasks,
    update: updateMission,
    validate: validateMission,
    plan: buildExecutionPlan,
    prioritize: prioritizeTasks,
    estimateDuration,
    estimateCost,
    start: startMission,
    pause: pauseMission,
    resume: resumeMission,
    cancel: cancelMission,
    complete: completeMission,
    updateTask: updateTaskProgress,
    getContext: getMissionContext,
    executeWorkflow: executeMissionWorkflow,
    getWorkflow: getWorkflowForMission,
    orchestrator: getMissionOrchestrator,
    getLastExecution: getLastExecutionResult,
  };
}
