import {
  WorkflowDefinition, WorkflowStep, ExecutionContext, ExecutionLog, StepExecution
} from './orchestrator.types';
import { resolveExecutionOrder, getReadySteps } from './dependency-resolver';
import { validateStepExecution } from './execution-validator';

export class WorkflowRunner {
  private currentExecution: ExecutionLog | null = null;
  private cancelled = false;

  async runWorkflow(
    workflow: WorkflowDefinition,
    context: ExecutionContext,
    onStepComplete?: (step: StepExecution) => void
  ): Promise<ExecutionLog> {
    this.cancelled = false;
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

          if (stepExec.type === 'connector') log.total_connector_calls++;
          else if (stepExec.type === 'engine') log.total_engine_calls++;
          else if (stepExec.type === 'agent') log.total_agent_calls++;

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

  private async executeStep(
    step: WorkflowStep,
    context: ExecutionContext,
    log: ExecutionLog
  ): Promise<any> {
    await this.sleep(Math.random() * 500 + 200);

    const baseResult = {
      step_id: step.id,
      target: step.target,
      type: step.type,
      timestamp: new Date().toISOString(),
    };

    switch (step.type) {
      case 'connector':
        return { ...baseResult, message: `Connector "${step.target}" synced successfully`, records: Math.floor(Math.random() * 100) + 10 };
      case 'engine':
        return { ...baseResult, message: `Engine "${step.target}" analysis completed`, scores: { overall: Math.floor(Math.random() * 40) + 50 } };
      case 'agent':
        return { ...baseResult, message: `Agent "${step.target}" execution completed`, tasks: Math.floor(Math.random() * 5) + 1 };
      default:
        return { ...baseResult, message: `Step "${step.id}" completed` };
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
