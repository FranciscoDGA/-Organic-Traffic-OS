import { JobDefinition, JobValidationError, SchedulerStatus } from './job-types';
import { jobRegistry } from './job-registry';
import { jobHistory } from './job-history';
import { jobValidator } from './job-validator';
import { jobRunner } from './job-runner';

export class JobManager {
  createJob(data: Omit<JobDefinition, 'id' | 'createdAt' | 'updatedAt'>): { job?: JobDefinition; errors: JobValidationError[] } {
    const errors = jobValidator.validateCreate(data);
    if (errors.length > 0) return { errors };
    const job = jobRegistry.create(data);
    return { job, errors: [] };
  }

  listJobs(): JobDefinition[] {
    return jobRegistry.getAll();
  }

  getJob(id: string): JobDefinition | undefined {
    return jobRegistry.get(id);
  }

  pauseJob(id: string): { success: boolean; errors: JobValidationError[] } {
    const job = jobRegistry.get(id);
    if (!job) return { success: false, errors: [{ field: 'id', message: 'Job not found' }] };
    const errors = jobValidator.validatePause(job);
    if (errors.length > 0) return { success: false, errors };
    jobRegistry.updateStatus(id, 'paused');
    return { success: true, errors: [] };
  }

  resumeJob(id: string): { success: boolean; errors: JobValidationError[] } {
    const job = jobRegistry.get(id);
    if (!job) return { success: false, errors: [{ field: 'id', message: 'Job not found' }] };
    const errors = jobValidator.validateResume(job);
    if (errors.length > 0) return { success: false, errors };
    jobRegistry.updateStatus(id, 'scheduled');
    return { success: true, errors: [] };
  }

  cancelJob(id: string): { success: boolean; errors: JobValidationError[] } {
    const job = jobRegistry.get(id);
    if (!job) return { success: false, errors: [{ field: 'id', message: 'Job not found' }] };
    const errors = jobValidator.validateCancel(job);
    if (errors.length > 0) return { success: false, errors };
    jobRegistry.updateStatus(id, 'cancelled');
    return { success: true, errors: [] };
  }

  async runNow(id: string): Promise<{ success: boolean; errors: JobValidationError[] }> {
    const job = jobRegistry.get(id);
    if (!job) return { success: false, errors: [{ field: 'id', message: 'Job not found' }] };
    const errors = jobValidator.validateRunNow(job);
    if (errors.length > 0) return { success: false, errors };
    const execution = await jobRunner.execute(job);
    jobRegistry.update(id, { lastRun: execution.startedAt, status: execution.status === 'completed' ? 'scheduled' : 'failed' });
    return { success: execution.status === 'completed', errors: [] };
  }

  getHistory() {
    return jobHistory.getAll();
  }

  getStatus(): SchedulerStatus {
    const all = jobRegistry.getAll();
    return {
      totalJobs: all.length,
      activeJobs: all.filter(j => j.status === 'scheduled' || j.status === 'pending').length,
      pausedJobs: all.filter(j => j.status === 'paused').length,
      failedJobs: all.filter(j => j.status === 'failed').length,
      runningJobs: all.filter(j => j.status === 'running').length,
      nextJob: jobRegistry.getNextScheduled() || undefined,
      lastExecution: jobHistory.getLatest(),
      uptimeMs: 0,
    };
  }

  calculateNextRun(job: JobDefinition): string | null {
    if (job.schedule.type === 'interval' && job.schedule.intervalMs) {
      const last = job.lastRun ? new Date(job.lastRun).getTime() : Date.now();
      return new Date(last + job.schedule.intervalMs).toISOString();
    }
    if (job.schedule.type === 'once') return null;
    if (job.schedule.type === 'manual') return null;
    return null;
  }
}

export const jobManager = new JobManager();
