import { WorkflowStep, WorkflowCondition, StepType } from './workflow.types';

export class WorkflowBuilder {
  private steps: WorkflowStep[] = [];

  addStep(id: string, name: string, type: StepType, options: Partial<WorkflowStep> = {}): WorkflowBuilder {
    this.steps.push({
      id, name, type,
      agentType: options.agentType,
      queue: options.queue,
      dependsOn: options.dependsOn || [],
      conditions: options.conditions || [],
      timeout: options.timeout,
      retryOnFail: options.retryOnFail || false,
      optional: options.optional || false,
    });
    return this;
  }

  addAgentStep(id: string, name: string, agentType: string, queue: string, dependsOn: string[] = []): WorkflowBuilder {
    return this.addStep(id, name, 'agent', { agentType, queue, dependsOn });
  }

  addApprovalStep(id: string, name: string, dependsOn: string[] = []): WorkflowBuilder {
    return this.addStep(id, name, 'approval', { dependsOn, conditions: [{ type: 'approval' }] });
  }

  addConditionStep(id: string, name: string, condition: WorkflowCondition, dependsOn: string[] = []): WorkflowBuilder {
    return this.addStep(id, name, 'condition', { dependsOn, conditions: [condition] });
  }

  addParallelStep(id: string, name: string, dependsOn: string[] = []): WorkflowBuilder {
    return this.addStep(id, name, 'parallel', { dependsOn });
  }

  build(): WorkflowStep[] {
    return [...this.steps];
  }

  reset(): void {
    this.steps = [];
  }
}
