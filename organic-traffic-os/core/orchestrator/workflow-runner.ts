import {
  WorkflowDefinition, WorkflowStep, ExecutionContext, ExecutionLog, StepExecution
} from './orchestrator.types';
import { resolveExecutionOrder } from './dependency-resolver';
import { validateStepExecution } from './execution-validator';
import { executeWorker, WorkerExecuteParams } from '../worker-mode/worker-executor';

export class WorkflowRunner {
  private currentExecution: ExecutionLog | null = null;
  private cancelled = false;
  private workerSessionIds: string[] = [];

  async runWorkflow(
    workflow: WorkflowDefinition,
    context: ExecutionContext,
    onStepComplete?: (step: StepExecution) => void
  ): Promise<ExecutionLog> {
    this.cancelled = false;
    this.workerSessionIds = [];
    const executionId = `exec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const orderedSteps = resolveExecutionOrder(workflow.steps);

    const log: ExecutionLog = {
      execution_id: executionId,
      workflow_id: workflow.id,
      workflow_name: workflow.name,
      context,
      status: 'running',
      started_at: new Date().toISOString(),
      steps: orderedSteps.map(s => ({
        step_id: s.id,
        step_name: s.name,
        type: s.type,
        target: s.target,
        status: 'pending' as const,
        retries: 0,
        ai_tokens_used: 0,
        connector_calls: 0,
      })),
      total_ai_tokens: 0,
      total_connector_calls: 0,
      total_engine_calls: 0,
      total_agent_calls: 0,
      warnings: [],
      errors: [],
    };

    this.currentExecution = log;
    const completedSteps = new Set<string>();

    for (const stepDef of orderedSteps) {
      if (this.cancelled) {
        log.status = 'cancelled';
        log.errors.push('Execution cancelled by user');
        break;
      }

      const validation = validateStepExecution(stepDef, completedSteps);
      if (!validation.valid) {
        const stepExec = log.steps.find(s => s.step_id === stepDef.id);
        if (stepExec) {
          stepExec.status = 'skipped';
          stepExec.error = validation.errors.join('; ');
        }
        log.warnings.push(`Step "${stepDef.id}" skipped: ${validation.errors.join('; ')}`);
        continue;
      }

      const stepExec = log.steps.find(s => s.step_id === stepDef.id);
      if (!stepExec) continue;

      stepExec.status = 'running';
      stepExec.started_at = new Date().toISOString();

      let success = false;
      let attempts = 0;
      const maxAttempts = stepDef.retry_policy.max_retries + 1;

      while (!success && attempts < maxAttempts && !this.cancelled) {
        attempts++;
        stepExec.retries = attempts - 1;

        try {
          const result = await this.executeStep(stepDef, context, log);
          stepExec.result = result;
          stepExec.status = 'completed';
          stepExec.completed_at = new Date().toISOString();
          stepExec.duration_ms = new Date(stepExec.completed_at).getTime() - new Date(stepExec.started_at).getTime();

          if (result?.tokens_used) stepExec.ai_tokens_used = result.tokens_used;
          if (stepExec.type === 'connector') log.total_connector_calls++;
          else if (stepExec.type === 'engine') log.total_engine_calls++;
          else if (stepExec.type === 'agent') log.total_agent_calls++;
          log.total_ai_tokens += stepExec.ai_tokens_used;

          success = true;
          completedSteps.add(stepDef.id);

          if (onStepComplete) onStepComplete(stepExec);
        } catch (err: any) {
          if (attempts < maxAttempts) {
            log.warnings.push(`Step "${stepDef.id}" attempt ${attempts} failed, retrying: ${err.message}`);
            await this.sleep(stepDef.retry_policy.delay_ms);
          } else {
            stepExec.status = 'failed';
            stepExec.completed_at = new Date().toISOString();
            stepExec.duration_ms = new Date(stepExec.completed_at).getTime() - new Date(stepExec.started_at).getTime();
            stepExec.error = err.message;
            log.errors.push(`Step "${stepDef.id}" failed after ${attempts} attempts: ${err.message}`);

            if (onStepComplete) onStepComplete(stepExec);
          }
        }
      }
    }

    log.completed_at = new Date().toISOString();
    log.duration_ms = new Date(log.completed_at).getTime() - new Date(log.started_at).getTime();

    const hasFailed = log.steps.some(s => s.status === 'failed');
    log.status = this.cancelled ? 'cancelled' : hasFailed ? 'failed' : 'completed';

    return log;
  }

  cancel(): void {
    this.cancelled = true;
  }

  getCurrentExecution(): ExecutionLog | null {
    return this.currentExecution;
  }

  getWorkerSessionIds(): string[] {
    return this.workerSessionIds;
  }

  private async executeStep(
    step: WorkflowStep,
    context: ExecutionContext,
    log: ExecutionLog
  ): Promise<any> {
    const baseResult = {
      step_id: step.id,
      target: step.target,
      type: step.type,
      timestamp: new Date().toISOString(),
    };

    switch (step.type) {
      case 'connector':
        return this.executeConnectorStep(step, context, baseResult);
      case 'engine':
        return this.executeEngineStep(step, context, baseResult);
      case 'agent':
        return this.executeAgentStep(step, context, baseResult);
      default:
        return { ...baseResult, message: `Step "${step.id}" completed` };
    }
  }

  private async executeConnectorStep(step: WorkflowStep, context: ExecutionContext, baseResult: Record<string, any>): Promise<any> {
    await this.sleep(Math.random() * 500 + 200);
    return {
      ...baseResult,
      message: `Connector "${step.target}" synced successfully`,
      records: Math.floor(Math.random() * 100) + 10,
      tokens_used: 0,
    };
  }

  private async executeEngineStep(step: WorkflowStep, context: ExecutionContext, baseResult: Record<string, any>): Promise<any> {
    await this.sleep(Math.random() * 800 + 300);
    return {
      ...baseResult,
      message: `Engine "${step.target}" analysis completed`,
      scores: { overall: Math.floor(Math.random() * 40) + 50 },
      tokens_used: 0,
    };
  }

  private async executeAgentStep(step: WorkflowStep, context: ExecutionContext, baseResult: Record<string, any>): Promise<any> {
    const params: WorkerExecuteParams = {
      agent_id: step.target,
      agent_name: step.name,
      workspace_id: context.blog_id,
      workflow_id: context.workflow_id,
      mission_id: context.config?.mission_id,
      provider: context.ai_provider,
      agent_type: step.target,
      context: {
        ...context.config,
        step_id: step.id,
        step_config: step.config,
      },
    };

    const result = await executeWorker(params);
    this.workerSessionIds.push(result.data?.session_id || '');

    return {
      ...baseResult,
      message: result.output,
      success: result.success,
      tokens_used: result.tokens_used,
      duration_ms: result.duration_ms,
      session_id: result.data?.session_id,
      agent_type: result.data?.agent_type,
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
