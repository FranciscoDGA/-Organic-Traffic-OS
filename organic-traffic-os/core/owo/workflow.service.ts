import { WorkflowDefinition, WorkflowExecution, WorkflowStep, WorkflowStatus } from './workflow.types';
import { WorkflowBuilder } from './workflow-builder';
import { DAGEngine } from './dag-engine';
import { ConditionEngine } from './condition-engine';
import { TransitionEngine } from './transition-engine';
import { workflowMonitor } from './workflow-monitor';
import { workflowTemplates } from './workflow-templates';

let idCounter = 0;
function genId(): string {
  return `wf-exec-${Date.now()}-${++idCounter}`;
}

class WorkflowService {
  private definitions: Map<string, WorkflowDefinition> = new Map();
  private dag = new DAGEngine();
  private conditionEngine = new ConditionEngine();
  private transitionEngine = new TransitionEngine();

  constructor() {
    for (const [key, tpl] of Object.entries(workflowTemplates)) {
      this.definitions.set(key, tpl);
    }
  }

  getDefinitions(): WorkflowDefinition[] {
    return Array.from(this.definitions.values());
  }

  getDefinition(id: string): WorkflowDefinition | undefined {
    for (const tpl of Object.values(workflowTemplates)) {
      if (tpl.id === id) return tpl;
    }
    return this.definitions.get(id);
  }

  validate(steps: WorkflowStep[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const ids = new Set(steps.map(s => s.id));

    if (this.dag.hasCycles(steps)) {
      errors.push('Workflow contem dependencia circular');
    }

    for (const step of steps) {
      for (const dep of step.dependsOn) {
        if (!ids.has(dep)) {
          errors.push(`Step "${step.id}" referencia dependencia inexistente: "${dep}"`);
        }
      }
    }

    const sorted = this.dag.topologicalSort(steps);
    if (sorted.length !== steps.length) {
      errors.push('Nem todos os steps podem ser ordenados topologicamente');
    }

    return { valid: errors.length === 0, errors };
  }

  start(workflowId: string, context: Record<string, unknown> = {}): WorkflowExecution | undefined {
    const def = this.getDefinition(workflowId);
    if (!def) return undefined;

    const validation = this.validate(def.steps);
    if (!validation.valid) return undefined;

    const exec: WorkflowExecution = {
      id: genId(),
      workflowId,
      status: 'running',
      currentSteps: [],
      completedSteps: [],
      failedSteps: [],
      startedAt: new Date().toISOString(),
      stepResults: {},
    };

    workflowMonitor.track(exec);

    const ready = this.dag.getReadySteps(def.steps, []);
    for (const stepId of ready) {
      exec.currentSteps.push(stepId);
    }

    return exec;
  }

  getExecution(executionId: string): WorkflowExecution | undefined {
    return workflowMonitor.getExecution(executionId);
  }

  getAllExecutions(): WorkflowExecution[] {
    return workflowMonitor.getAllExecutions();
  }

  getActiveExecutions(): WorkflowExecution[] {
    return workflowMonitor.getActiveExecutions();
  }

  pause(executionId: string): boolean {
    const exec = workflowMonitor.getExecution(executionId);
    if (!exec || exec.status !== 'running') return false;
    exec.status = 'paused';
    return true;
  }

  resume(executionId: string): boolean {
    const exec = workflowMonitor.getExecution(executionId);
    if (!exec || exec.status !== 'paused') return false;
    exec.status = 'running';
    return true;
  }

  cancel(executionId: string): boolean {
    const exec = workflowMonitor.getExecution(executionId);
    if (!exec || (exec.status !== 'running' && exec.status !== 'paused')) return false;
    exec.status = 'cancelled';
    return true;
  }

  getDAG(workflowId: string): { nodes: import('./workflow.types').DAGNode[]; edges: import('./workflow.types').DAGEdge[] } | undefined {
    const def = this.getDefinition(workflowId);
    if (!def) return undefined;
    return this.dag.buildDAG(def.steps);
  }

  getReadySteps(workflowId: string, completedSteps: string[]): string[] {
    const def = this.getDefinition(workflowId);
    if (!def) return [];
    return this.dag.getReadySteps(def.steps, completedSteps);
  }
}

export const workflowService = new WorkflowService();
