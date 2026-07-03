import { getCEODashboardData } from '../../../../../organic-traffic-os/core/ceo-dashboard/ceo-dashboard.service';

export function getCEOServiceSingleton() {
  return getCEODashboardData();
}
