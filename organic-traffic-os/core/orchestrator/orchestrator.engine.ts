import {
  ExecutionContext, ExecutionLog, ExecutionResult, OrchestratorStatus
} from './orchestrator.types';
import { WorkflowRegistry } from './workflow-registry';
import { WorkflowRunner } from './workflow-runner';
import { createExecutionContext } from './execution-context';
import { validateWorkflowExecution } from './execution-validator';
import { createExecutionResult } from './execution-result';

export class OrchestratorEngine {
  private registry: WorkflowRegistry;
  private runner: WorkflowRunner;
  private executionHistory: ExecutionLog[] = [];
  private currentExecution: ExecutionLog | null = null;
  private queue: { workflow_id: string; context: ExecutionContext }[] = [];

  constructor() {
    this.registry = new WorkflowRegistry();
    this.runner = new WorkflowRunner();
  }

  async startExecution(
    workflowId: string,
    params: {
      blog_id?: string;
      channel?: string;
      user_id?: string;
      content_id?: string;
      config?: Record<string, any>;
      ai_provider?: string;
      language?: string;
    } = {}
  ): Promise<ExecutionResult> {
    const workflow = this.registry.getWorkflow(workflowId);
    if (!workflow) {
      return {
        success: false, execution_id: '', workflow_id: workflowId,
        status: 'failed', duration_ms: 0, steps_completed: 0,
        steps_failed: 0, steps_total: 0, error: `Workflow "${workflowId}" not found`,
      };
    }

    const context = createExecutionContext({ ...params, workflow_id: workflowId });

    const validation = validateWorkflowExecution(workflow, context);
    if (!validation.valid) {
      return {
        success: false, execution_id: '', workflow_id: workflowId,
        status: 'failed', duration_ms: 0, steps_completed: 0,
        steps_failed: 0, steps_total: workflow.steps.length,
        error: validation.errors.join('; '),
      };
    }

    const log = await this.runner.runWorkflow(workflow, context, (step) => {
      if (this.currentExecution) {
        const idx = this.currentExecution.steps.findIndex(s => s.step_id === step.step_id);
        if (idx >= 0) this.currentExecution.steps[idx] = step;
      }
    });

    this.currentExecution = null;
    this.executionHistory.push(log);
    if (this.executionHistory.length > 50) this.executionHistory.shift();

    return createExecutionResult(log);
  }

  stopExecution(): boolean {
    if (this.currentExecution) {
      this.runner.cancel();
      return true;
    }
    return false;
  }

  getStatus(): OrchestratorStatus {
    return {
      is_running: this.currentExecution !== null,
      current_execution: this.currentExecution || undefined,
      queued_executions: this.queue.length,
      total_executions: this.executionHistory.length,
      successful_executions: this.executionHistory.filter(e => e.status === 'completed').length,
      failed_executions: this.executionHistory.filter(e => e.status === 'failed').length,
      average_duration_ms: this.executionHistory.length > 0
        ? Math.round(this.executionHistory.reduce((sum, e) => sum + (e.duration_ms || 0), 0) / this.executionHistory.length)
        : 0,
    };
  }

  getHistory(): ExecutionLog[] {
    return [...this.executionHistory].reverse();
  }

  getWorkflows() {
    return this.registry.getAllWorkflows();
  }

  getRegistry(): WorkflowRegistry {
    return this.registry;
  }
}
