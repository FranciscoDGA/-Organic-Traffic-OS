import { WorkflowStep } from './orchestrator.types';

export function resolveExecutionOrder(steps: WorkflowStep[]): WorkflowStep[] {
  const resolved: WorkflowStep[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(step: WorkflowStep) {
    if (visited.has(step.id)) return;
    if (visiting.has(step.id)) {
      throw new Error(`Circular dependency detected: ${step.id}`);
    }

    visiting.add(step.id);

    for (const depId of step.depends_on) {
      const depStep = steps.find(s => s.id === depId);
      if (depStep) {
        visit(depStep);
      } else {
        throw new Error(`Dependency not found: ${depId} required by ${step.id}`);
      }
    }

    visiting.delete(step.id);
    visited.add(step.id);
    resolved.push(step);
  }

  for (const step of steps) {
    visit(step);
  }

  return resolved;
}

export function validateDependencies(steps: WorkflowStep[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const stepIds = new Set(steps.map(s => s.id));

  for (const step of steps) {
    for (const depId of step.depends_on) {
      if (!stepIds.has(depId)) {
        errors.push(`Step "${step.id}" depends on "${depId}" which does not exist`);
      }
    }
  }

  const checkCircular = (stepId: string, path: Set<string>): boolean => {
    if (path.has(stepId)) return true;
    const step = steps.find(s => s.id === stepId);
    if (!step) return false;
    path.add(stepId);
    for (const dep of step.depends_on) {
      if (checkCircular(dep, new Set(path))) return true;
    }
    return false;
  };

  for (const step of steps) {
    if (checkCircular(step.id, new Set())) {
      errors.push(`Circular dependency detected involving "${step.id}"`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function getReadySteps(steps: WorkflowStep[], completedSteps: Set<string>): WorkflowStep[] {
  return steps.filter(step => {
    if (completedSteps.has(step.id)) return false;
    return step.depends_on.every(dep => completedSteps.has(dep));
  });
}
