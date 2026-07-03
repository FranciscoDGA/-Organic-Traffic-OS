import { ExecutionResult, ExecutionLog } from './orchestrator.types';

export function createExecutionResult(log: ExecutionLog): ExecutionResult {
  const stepsCompleted = log.steps.filter(s => s.status === 'completed').length;
  const stepsFailed = log.steps.filter(s => s.status === 'failed').length;

  return {
    success: log.status === 'completed',
    execution_id: log.execution_id,
    workflow_id: log.workflow_id,
    status: log.status,
    duration_ms: log.duration_ms || 0,
    steps_completed: stepsCompleted,
    steps_failed: stepsFailed,
    steps_total: log.steps.length,
    error: log.errors.length > 0 ? log.errors[log.errors.length - 1] : undefined,
  };
}
