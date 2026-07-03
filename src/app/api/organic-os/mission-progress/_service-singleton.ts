import { getMissionProgressService } from '../../../../../organic-traffic-os/core/mission-progress/mission-progress-index';

export function getMissionProgressServiceSingleton() {
  return getMissionProgressService();
}
