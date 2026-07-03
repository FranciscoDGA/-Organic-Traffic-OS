import { getMissionControlService } from '../../../../../organic-traffic-os/core/mission-control/mission-index';

export function getMissionServiceSingleton() {
  return getMissionControlService();
}
