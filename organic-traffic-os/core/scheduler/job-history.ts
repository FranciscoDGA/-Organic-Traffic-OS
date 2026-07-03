import { JobExecution } from './job-types';

export class JobHistory {
  private executions: JobExecution[] = [];
  private maxHistory = 500;

  add(execution: JobExecution): void {
    this.executions.unshift(execution);
    if (this.executions.length > this.maxHistory) {
      this.executions = this.executions.slice(0, this.maxHistory);
    }
  }

  update(id: string, updates: Partial<JobExecution>): JobExecution | null {
    const exec = this.executions.find(e => e.id === id);
    if (!exec) return null;
    Object.assign(exec, updates);
    return exec;
  }

  getAll(): JobExecution[] {
    return [...this.executions];
  }

  getByJobId(jobId: string): JobExecution[] {
    return this.executions.filter(e => e.jobId === jobId);
  }

  getLatest(): JobExecution | undefined {
    return this.executions[0];
  }

  getRecent(limit = 20): JobExecution[] {
    return this.executions.slice(0, limit);
  }

  getSuccessful(): JobExecution[] {
    return this.executions.filter(e => e.status === 'completed');
  }

  getFailed(): JobExecution[] {
    return this.executions.filter(e => e.status === 'failed');
  }

  getByJobIdAndStatus(jobId: string, status: JobExecution['status']): JobExecution[] {
    return this.executions.filter(e => e.jobId === jobId && e.status === status);
  }

  clear(): void {
    this.executions = [];
  }

  size(): number {
    return this.executions.length;
  }
}

export const jobHistory = new JobHistory();
