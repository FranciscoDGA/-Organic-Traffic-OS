import { OrchestratorService } from '../../../../../organic-traffic-os/core/orchestrator/orchestrator.service';

let serviceInstance: OrchestratorService | null = null;

export function getOrchestratorService(): OrchestratorService {
  if (!serviceInstance) {
    serviceInstance = new OrchestratorService();
  }
  return serviceInstance;
}
