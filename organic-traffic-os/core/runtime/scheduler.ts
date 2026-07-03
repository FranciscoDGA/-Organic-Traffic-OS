import { Schedule, ScheduleType } from './runtime.types';
import { eventBus } from './event-bus';

export class Scheduler {
  private schedules: Map<string, Schedule> = new Map();
  private timers: Map<string, ReturnType<typeof setInterval>> = new Map();
  private running = false;

  addSchedule(workflowId: string, type: ScheduleType, expression: string, intervalMs?: number): Schedule {
    const schedule: Schedule = {
      id: `sched-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      workflowId,
      type,
      expression,
      intervalMs,
      enabled: true,
      manualTrigger: type === 'manual',
    };
    this.schedules.set(schedule.id, schedule);
    if (this.running && type === 'interval' && intervalMs) {
      this.startTimer(schedule);
    }
    return schedule;
  }

  removeSchedule(scheduleId: string): boolean {
    this.stopTimer(scheduleId);
    return this.schedules.delete(scheduleId);
  }

  enableSchedule(scheduleId: string): boolean {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) return false;
    schedule.enabled = true;
    if (this.running && schedule.type === 'interval' && schedule.intervalMs) {
      this.startTimer(schedule);
    }
    return true;
  }

  disableSchedule(scheduleId: string): boolean {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) return false;
    schedule.enabled = false;
    this.stopTimer(scheduleId);
    return true;
  }

  triggerManual(scheduleId: string): Schedule | null {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule || !schedule.manualTrigger) return null;
    schedule.lastRun = new Date().toISOString();
    eventBus.emit('WorkflowStarted', 'scheduler', { scheduleId, workflowId: schedule.workflowId });
    return schedule;
  }

  getSchedules(): Schedule[] {
    return Array.from(this.schedules.values());
  }

  getSchedule(scheduleId: string): Schedule | undefined {
    return this.schedules.get(scheduleId);
  }

  getNextScheduled(): Schedule | null {
    const now = Date.now();
    let closest: Schedule | null = null;
    let closestTime = Infinity;
    for (const schedule of this.schedules.values()) {
      if (!schedule.enabled || schedule.type === 'manual') continue;
      if (schedule.nextRun) {
        const nextTime = new Date(schedule.nextRun).getTime();
        if (nextTime > now && nextTime < closestTime) {
          closestTime = nextTime;
          closest = schedule;
        }
      }
    }
    return closest;
  }

  start(): void {
    this.running = true;
    for (const schedule of this.schedules.values()) {
      if (schedule.enabled && schedule.type === 'interval' && schedule.intervalMs) {
        this.startTimer(schedule);
      }
    }
  }

  stop(): void {
    this.running = false;
    for (const [id] of this.timers) {
      this.stopTimer(id);
    }
    this.timers.clear();
  }

  private startTimer(schedule: Schedule): void {
    if (this.timers.has(schedule.id)) return;
    if (!schedule.intervalMs) return;
    const timer = setInterval(() => {
      schedule.lastRun = new Date().toISOString();
      const nextMs = Date.now() + schedule.intervalMs!;
      schedule.nextRun = new Date(nextMs).toISOString();
      eventBus.emit('WorkflowStarted', 'scheduler', { scheduleId: schedule.id, workflowId: schedule.workflowId, auto: true });
    }, schedule.intervalMs);
    this.timers.set(schedule.id, timer);
    schedule.nextRun = new Date(Date.now() + schedule.intervalMs).toISOString();
  }

  private stopTimer(scheduleId: string): void {
    const timer = this.timers.get(scheduleId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(scheduleId);
    }
  }
}

export const scheduler = new Scheduler();
