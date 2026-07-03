import { JobDefinition, JobValidationError, JobType, ScheduleType } from './job-types';

const VALID_JOB_TYPES: JobType[] = [
  'connector_sync',
  'workflow_run',
  'agent_run',
  'monitoring_run',
  'report_generation',
  'content_refresh',
  'publishing_prepare',
];

const SAFE_JOB_TYPES: JobType[] = [
  'connector_sync',
  'monitoring_run',
  'report_generation',
  'content_refresh',
  'publishing_prepare',
];

export class JobValidator {
  validateCreate(data: Partial<JobDefinition>): JobValidationError[] {
    const errors: JobValidationError[] = [];
    if (!data.name || data.name.trim().length === 0) errors.push({ field: 'name', message: 'Name is required' });
    if (!data.type) errors.push({ field: 'type', message: 'Type is required' });
    else if (!VALID_JOB_TYPES.includes(data.type)) errors.push({ field: 'type', message: `Invalid type. Valid: ${VALID_JOB_TYPES.join(', ')}` });
    if (!data.schedule) errors.push({ field: 'schedule', message: 'Schedule is required' });
    else {
      if (!data.schedule.type) errors.push({ field: 'schedule.type', message: 'Schedule type is required' });
      else if (!['cron', 'interval', 'once', 'manual'].includes(data.schedule.type)) errors.push({ field: 'schedule.type', message: 'Invalid schedule type' });
      if (data.schedule.type === 'cron' && !data.schedule.expression) errors.push({ field: 'schedule.expression', message: 'Cron expression is required' });
      if (data.schedule.type === 'interval' && (!data.schedule.intervalMs || data.schedule.intervalMs < 1000)) errors.push({ field: 'schedule.intervalMs', message: 'Interval must be >= 1000ms' });
    }
    if (!data.target) errors.push({ field: 'target', message: 'Target is required' });
    if (data.timeoutMs !== undefined && data.timeoutMs < 1000) errors.push({ field: 'timeoutMs', message: 'Timeout must be >= 1000ms' });
    if (data.maxRetries !== undefined && (data.maxRetries < 0 || data.maxRetries > 10)) errors.push({ field: 'maxRetries', message: 'Max retries must be 0-10' });
    return errors;
  }

  validatePause(job: JobDefinition): JobValidationError[] {
    const errors: JobValidationError[] = [];
    if (job.status !== 'scheduled' && job.status !== 'pending') errors.push({ field: 'status', message: 'Only scheduled/pending jobs can be paused' });
    return errors;
  }

  validateResume(job: JobDefinition): JobValidationError[] {
    const errors: JobValidationError[] = [];
    if (job.status !== 'paused') errors.push({ field: 'status', message: 'Only paused jobs can be resumed' });
    return errors;
  }

  validateCancel(job: JobDefinition): JobValidationError[] {
    const errors: JobValidationError[] = [];
    if (job.status === 'completed' || job.status === 'cancelled') errors.push({ field: 'status', message: 'Job already finished' });
    return errors;
  }

  validateRunNow(job: JobDefinition): JobValidationError[] {
    const errors: JobValidationError[] = [];
    if (job.status === 'running') errors.push({ field: 'status', message: 'Job is already running' });
    if (job.status === 'cancelled') errors.push({ field: 'status', message: 'Cannot run cancelled job' });
    return errors;
  }

  isSafeType(type: JobType): boolean {
    return SAFE_JOB_TYPES.includes(type);
  }

  getValidTypes(): JobType[] {
    return [...VALID_JOB_TYPES];
  }

  getSafeTypes(): JobType[] {
    return [...SAFE_JOB_TYPES];
  }
}

export const jobValidator = new JobValidator();
