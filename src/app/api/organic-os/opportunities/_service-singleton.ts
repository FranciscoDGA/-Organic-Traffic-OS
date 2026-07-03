import { getOpportunityService } from '../../../../../organic-traffic-os/core/opportunity-manager/opportunity-index';

export function getOpportunityServiceSingleton() {
  return getOpportunityService();
}
