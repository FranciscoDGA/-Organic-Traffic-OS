import { RuntimeJob } from './runtime.types';

interface WorkflowStep {
  id: string;
  name: string;
  agentType: string;
  queue: string;
  dependsOn: string[];
}

interface WorkflowDefinition {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

const WORKFLOWS: WorkflowDefinition[] = [
  {
    id: 'content-creation', name: 'Content Creation',
    steps: [
      { id: 'research', name: 'Research', agentType: 'research', queue: 'content', dependsOn: [] },
      { id: 'write', name: 'Write', agentType: 'writer', queue: 'content', dependsOn: ['research'] },
      { id: 'review', name: 'Review', agentType: 'review', queue: 'content', dependsOn: ['write'] },
      { id: 'publish', name: 'Publish', agentType: 'publisher', queue: 'publishing', dependsOn: ['review'] },
    ],
  },
  {
    id: 'seo-audit', name: 'SEO Audit',
    steps: [
      { id: 'collect', name: 'Collect Data', agentType: 'collector', queue: 'missions', dependsOn: [] },
      { id: 'analyze', name: 'Analyze', agentType: 'analyzer', queue: 'analytics', dependsOn: ['collect'] },
      { id: 'report', name: 'Report', agentType: 'reporter', queue: 'analytics', dependsOn: ['analyze'] },
    ],
  },
  {
    id: 'data-sync', name: 'Data Sync',
    steps: [
      { id: 'fetch', name: 'Fetch', agentType: 'collector', queue: 'refresh', dependsOn: [] },
      { id: 'process', name: 'Process', agentType: 'processor', queue: 'updates', dependsOn: ['fetch'] },
      { id: 'store', name: 'Store', agentType: 'storage', queue: 'system', dependsOn: ['process'] },
    ],
  },
];

export class WorkflowEngine {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private executions: Map<string, { workflowId: string; currentStep: string; completedSteps: string[]; jobId?: string }> = new Map();

  constructor() {
    for (const wf of WORKFLOWS) this.workflows.set(wf.id, wf);
  }

  getWorkflows(): WorkflowDefinition[] { return Array.from(this.workflows.values()); }
  getWorkflow(id: string): WorkflowDefinition | undefined { return this.workflows.get(id); }

  startExecution(workflowId: string): string | null {
    const wf = this.workflows.get(workflowId);
    if (!wf) return null;
    const execId = `exec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.executions.set(execId, { workflowId, currentStep: wf.steps[0]?.id || '', completedSteps: [] });
    return execId;
  }

  getNextStep(executionId: string): WorkflowStep | null {
    const exec = this.executions.get(executionId);
    if (!exec) return null;
    const wf = this.workflows.get(exec.workflowId);
    if (!wf) return null;
    for (const step of wf.steps) {
      if (exec.completedSteps.includes(step.id)) continue;
      const depsMet = step.dependsOn.every(d => exec.completedSteps.includes(d));
      if (depsMet) return step;
    }
    return null;
  }

  completeStep(executionId: string, stepId: string): void {
    const exec = this.executions.get(executionId);
    if (exec) exec.completedSteps.push(stepId);
  }

  getExecution(executionId: string) { return this.executions.get(executionId); }
}
