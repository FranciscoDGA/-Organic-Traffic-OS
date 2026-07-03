import { JobDefinition, JobExecution } from './job-types';
import { jobHistory } from './job-history';

export class JobRunner {
  private runningJobs: Map<string, JobExecution> = new Map();

  async execute(job: JobDefinition): Promise<JobExecution> {
    const execution: JobExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      jobId: job.id,
      jobName: job.name,
      jobType: job.type,
      status: 'running',
      startedAt: new Date().toISOString(),
      retryAttempt: job.retries,
    };

    this.runningJobs.set(job.id, execution);
    jobHistory.add(execution);

    try {
      const result = await this.runJob(job);
      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();
      execution.durationMs = new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime();
      execution.result = result;
    } catch (err) {
      execution.status = 'failed';
      execution.completedAt = new Date().toISOString();
      execution.durationMs = new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime();
      execution.error = (err as Error).message;
    } finally {
      this.runningJobs.delete(job.id);
    }

    return execution;
  }

  cancel(jobId: string): boolean {
    const execution = this.runningJobs.get(jobId);
    if (!execution) return false;
    execution.status = 'cancelled';
    execution.completedAt = new Date().toISOString();
    execution.durationMs = new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime();
    this.runningJobs.delete(jobId);
    return true;
  }

  isRunning(jobId: string): boolean {
    return this.runningJobs.has(jobId);
  }

  getRunning(): JobExecution[] {
    return Array.from(this.runningJobs.values());
  }

  private async runJob(job: JobDefinition): Promise<Record<string, unknown>> {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));

    switch (job.type) {
      case 'connector_sync':
        return { synced: true, items: Math.floor(Math.random() * 100), connector: job.target.connectorId || 'unknown' };
      case 'workflow_run':
        return { completed: true, workflow: job.target.workflowId || 'unknown' };
      case 'agent_run':
        return { completed: true, agent: job.target.agentId || 'unknown' };
      case 'monitoring_run':
        return { checked: true, alerts: 0 };
      case 'report_generation':
        return { generated: true, format: 'json' };
      case 'content_refresh':
        return { refreshed: true, items: Math.floor(Math.random() * 50) };
      case 'publishing_prepare':
        return { prepared: true, draft: true };
      default:
        return { completed: true };
    }
  }
}

export const jobRunner = new JobRunner();
