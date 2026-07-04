import { Mission, MissionType } from './mission.types';
import { getOrchestratorEngine } from '../orchestrator/orchestrator.service';
import { ExecutionResult } from '../orchestrator/orchestrator.types';

export const MISSION_WORKFLOW_MAP: Record<MissionType, string> = {
  'blog-launch': 'content-creation',
  'cluster-expansion': 'full-seo-cycle',
  'growth': 'full-seo-cycle',
  'bulk-update': 'content-creation',
  'traffic-recovery': 'intelligence-analysis',
  'thematic-authority': 'intelligence-analysis',
  'ai-optimization': 'intelligence-analysis',
  'content-migration': 'publish-pipeline',
  'full-audit': 'data-collection',
};

export interface MissionExecutionResult {
  mission_id: string;
  workflow_id: string;
  execution_id: string;
  success: boolean;
  status: string;
  steps_completed: number;
  steps_failed: number;
  steps_total: number;
  duration_ms: number;
  error?: string;
}

export async function executeMissionWorkflow(mission: Mission): Promise<MissionExecutionResult | null> {
  const workflowId = MISSION_WORKFLOW_MAP[mission.type];
  if (!workflowId) return null;

  const engine = getOrchestratorEngine();
  const result: ExecutionResult = await engine.startExecution(workflowId, {
    blog_id: mission.workspaceId,
    user_id: mission.owner,
    config: {
      mission_id: mission.id,
      mission_type: mission.type,
      objective: mission.objective,
      strategy: mission.strategy,
      priority: mission.priority,
    },
  });

  return {
    mission_id: mission.id,
    workflow_id: workflowId,
    execution_id: result.execution_id,
    success: result.success,
    status: result.status,
    steps_completed: result.steps_completed,
    steps_failed: result.steps_failed,
    steps_total: result.steps_total,
    duration_ms: result.duration_ms,
    error: result.error,
  };
}

export function getWorkflowForMission(type: MissionType): string | null {
  return MISSION_WORKFLOW_MAP[type] || null;
}

export function getMissionOrchestrator() {
  return {
    execute: executeMissionWorkflow,
    getWorkflow: getWorkflowForMission,
    getWorkflowMap: () => MISSION_WORKFLOW_MAP,
  };
}
