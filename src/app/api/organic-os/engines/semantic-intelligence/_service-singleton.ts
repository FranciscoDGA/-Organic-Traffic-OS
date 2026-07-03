import { SemanticIntelligenceService } from '../../../../../../organic-traffic-os/core/engines/semantic-intelligence/semantic-intelligence.service';

let serviceInstance: SemanticIntelligenceService | null = null;

export function getSemanticIntelligenceService(): SemanticIntelligenceService {
  if (!serviceInstance) {
    serviceInstance = new SemanticIntelligenceService();
  }
  return serviceInstance;
}
