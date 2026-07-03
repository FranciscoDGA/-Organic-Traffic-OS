import { OrchestratorEngine } from './orchestrator.engine';
import {
  ExecutionResult, ExecutionLog, OrchestratorStatus
} from './orchestrator.types';

let engineInstance: OrchestratorEngine | null = null;

export function getOrchestratorEngine(): OrchestratorEngine {
  if (!engineInstance) {
    engineInstance = new OrchestratorEngine();
  }
  return engineInstance;
}

export class OrchestratorService {
  private engine: OrchestratorEngine;

  constructor() {
    this.engine = getOrchestratorEngine();
  }

  async runWorkflow(workflowId: string, params?: Record<string, any>): Promise<ExecutionResult> {
    return this.engine.startExecution(workflowId, params || {});
  }

  stopExecution(): boolean {
    return this.engine.stopExecution();
  }

  getStatus(): OrchestratorStatus {
    return this.engine.getStatus();
  }

  getHistory(): ExecutionLog[] {
    return this.engine.getHistory();
  }

  getWorkflows() {
    return this.engine.getWorkflows();
  }

  getReport() {
    const status = this.getStatus();
    const recentExecutions = this.getHistory().slice(0, 10);
    const workflows = this.getWorkflows();

    return {
      timestamp: new Date().toISOString(),
      status,
      recent_executions: recentExecutions,
      workflows_registered: workflows.length,
      logs: [
        { timestamp: new Date().toISOString(), level: 'info', action: 'status_check', message: `Orchestrator status: ${status.is_running ? 'running' : 'idle'}, ${status.total_executions} total executions` },
      ],
    };
  }
}
