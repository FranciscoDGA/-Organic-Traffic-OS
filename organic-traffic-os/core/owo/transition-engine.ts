import { WorkflowStep, StepStatus } from './workflow.types';

export class TransitionEngine {
  private transitions: Map<string, StepStatus[]> = new Map([
    ['pending', ['ready', 'cancelled']],
    ['ready', ['running', 'skipped', 'cancelled']],
    ['running', ['completed', 'failed', 'waiting', 'cancelled']],
    ['waiting', ['running', 'cancelled']],
    ['failed', ['ready', 'cancelled']],
    ['completed', []],
    ['skipped', []],
    ['cancelled', []],
  ]);

  canTransition(from: StepStatus, to: StepStatus): boolean {
    return this.transitions.get(from)?.includes(to) ?? false;
  }

  getValidTransitions(status: StepStatus): StepStatus[] {
    return this.transitions.get(status) || [];
  }

  transition(step: WorkflowStep, currentStatus: StepStatus, newStatus: StepStatus): { valid: boolean; error?: string } {
    if (!this.canTransition(currentStatus, newStatus)) {
      return { valid: false, error: `Invalid transition: ${currentStatus} -> ${newStatus}` };
    }
    return { valid: true };
  }
}
