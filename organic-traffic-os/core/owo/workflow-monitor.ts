import { WorkflowExecution, StepStatus } from './workflow.types';

class WorkflowMonitor {
  private executions: Map<string, WorkflowExecution> = new Map();

  track(execution: WorkflowExecution): void {
    this.executions.set(execution.id, execution);
  }

  updateStep(executionId: string, stepId: string, status: StepStatus, result?: unknown): void {
    const exec = this.executions.get(executionId);
    if (!exec) return;
    if (status === 'completed') {
      exec.completedSteps.push(stepId);
      exec.currentSteps = exec.currentSteps.filter(s => s !== stepId);
      exec.stepResults[stepId] = result;
    } else if (status === 'failed') {
      exec.failedSteps.push(stepId);
      exec.currentSteps = exec.currentSteps.filter(s => s !== stepId);
    } else if (status === 'running') {
      exec.currentSteps.push(stepId);
    }
  }

  getExecution(executionId: string): WorkflowExecution | undefined {
    return this.executions.get(executionId);
  }

  getAllExecutions(): WorkflowExecution[] {
    return Array.from(this.executions.values());
  }

  getActiveExecutions(): WorkflowExecution[] {
    return this.getAllExecutions().filter(e => e.status === 'running' || e.status === 'paused');
  }

  getByWorkflow(workflowId: string): WorkflowExecution[] {
    return this.getAllExecutions().filter(e => e.workflowId === workflowId);
  }
}

export const workflowMonitor = new WorkflowMonitor();
