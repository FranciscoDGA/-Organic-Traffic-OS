import { ContentIntelligenceService } from '../../../../../../organic-traffic-os/core/engines/content-intelligence/content-intelligence.service';

let serviceInstance: ContentIntelligenceService | null = null;

export function getContentIntelligenceService(): ContentIntelligenceService {
  if (!serviceInstance) {
    serviceInstance = new ContentIntelligenceService();
  }
  return serviceInstance;
}
