import { OpportunityIntelligenceService } from '../../../../../../organic-traffic-os/core/engines/opportunity-intelligence/opportunity-intelligence.service';

let serviceInstance: OpportunityIntelligenceService | null = null;

export function getOpportunityIntelligenceService(): OpportunityIntelligenceService {
  if (!serviceInstance) {
    serviceInstance = new OpportunityIntelligenceService();
  }
  return serviceInstance;
}
