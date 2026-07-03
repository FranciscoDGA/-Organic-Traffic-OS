import { getSchedulerEngine } from '../../../../../organic-traffic-os/core/scheduler/scheduler-engine';

let engineInstance: ReturnType<typeof getSchedulerEngine> | null = null;

export function getSchedulerEngineInstance() {
  if (!engineInstance) {
    engineInstance = getSchedulerEngine();
  }
  return engineInstance;
}
