import { AuthorityIntelligenceService } from '../../../../../../organic-traffic-os/core/engines/authority-intelligence/authority-intelligence.service';

let serviceInstance: AuthorityIntelligenceService | null = null;

export function getAuthorityIntelligenceService(): AuthorityIntelligenceService {
  if (!serviceInstance) {
    serviceInstance = new AuthorityIntelligenceService();
  }
  return serviceInstance;
}
