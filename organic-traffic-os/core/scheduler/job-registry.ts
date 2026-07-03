import { JobDefinition, JobStatus, JobType } from './job-types';

export class JobRegistry {
  private jobs: Map<string, JobDefinition> = new Map();

  create(job: Omit<JobDefinition, 'id' | 'createdAt' | 'updatedAt'>): JobDefinition {
    const id = `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const full: JobDefinition = { ...job, id, createdAt: now, updatedAt: now };
    this.jobs.set(id, full);
    return full;
  }

  get(id: string): JobDefinition | undefined {
    return this.jobs.get(id);
  }

  getAll(): JobDefinition[] {
    return Array.from(this.jobs.values());
  }

  getByType(type: JobType): JobDefinition[] {
    return this.getAll().filter(j => j.type === type);
  }

  getByStatus(status: JobStatus): JobDefinition[] {
    return this.getAll().filter(j => j.status === status);
  }

  getActive(): JobDefinition[] {
    return this.getAll().filter(j => j.status === 'scheduled' || j.status === 'running' || j.status === 'pending');
  }

  getPaused(): JobDefinition[] {
    return this.getByStatus('paused');
  }

  getFailed(): JobDefinition[] {
    return this.getByStatus('failed');
  }

  update(id: string, updates: Partial<JobDefinition>): JobDefinition | null {
    const job = this.jobs.get(id);
    if (!job) return null;
    const updated = { ...job, ...updates, updatedAt: new Date().toISOString() };
    this.jobs.set(id, updated);
    return updated;
  }

  updateStatus(id: string, status: JobStatus): JobDefinition | null {
    return this.update(id, { status });
  }

  delete(id: string): boolean {
    return this.jobs.delete(id);
  }

  getNextScheduled(): JobDefinition | null {
    const now = Date.now();
    let closest: JobDefinition | null = null;
    let closestTime = Infinity;
    for (const job of this.jobs.values()) {
      if (job.status !== 'scheduled' && job.status !== 'pending') continue;
      if (job.nextRun) {
        const nextTime = new Date(job.nextRun).getTime();
        if (nextTime >= now && nextTime < closestTime) {
          closestTime = nextTime;
          closest = job;
        }
      }
    }
    return closest;
  }

  size(): number {
    return this.jobs.size;
  }
}

export const jobRegistry = new JobRegistry();
