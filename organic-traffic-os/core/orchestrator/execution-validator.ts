import { WorkflowDefinition, WorkflowStep, ExecutionContext } from './orchestrator.types';

export function validateWorkflowExecution(
  workflow: WorkflowDefinition,
  context: ExecutionContext
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!workflow) {
    errors.push('Workflow not found');
    return { valid: false, errors };
  }

  if (workflow.status !== 'active') {
    errors.push(`Workflow "${workflow.id}" is not active (status: ${workflow.status})`);
  }

  if (!context.blog_id) {
    errors.push('blog_id is required in execution context');
  }

  if (!context.workflow_id) {
    errors.push('workflow_id is required in execution context');
  }

  if (workflow.steps.length === 0) {
    errors.push('Workflow has no steps');
  }

  for (const step of workflow.steps) {
    if (!step.target) {
      errors.push(`Step "${step.id}" has no target`);
    }
    if (step.timeout_ms <= 0) {
      errors.push(`Step "${step.id}" has invalid timeout`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateStepExecution(
  step: WorkflowStep,
  completedSteps: Set<string>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const depId of step.depends_on) {
    if (!completedSteps.has(depId)) {
      errors.push(`Dependency "${depId}" not completed`);
    }
  }

  return { valid: errors.length === 0, errors };
}
