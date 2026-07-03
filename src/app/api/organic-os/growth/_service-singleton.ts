import { getGrowthService } from '../../../../../organic-traffic-os/core/growth/autonomous-growth.engine';

export function getGrowthServiceSingleton() {
  return getGrowthService();
}
