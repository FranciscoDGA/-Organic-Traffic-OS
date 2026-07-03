import { PredictiveIntelligenceService } from '../../../../../../organic-traffic-os/core/engines/predictive-intelligence/predictive-intelligence.service';

let serviceInstance: PredictiveIntelligenceService | null = null;

export function getPredictiveIntelligenceService(): PredictiveIntelligenceService {
  if (!serviceInstance) {
    serviceInstance = new PredictiveIntelligenceService();
  }
  return serviceInstance;
}
