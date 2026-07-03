import { getExecutionService } from '../../../../../organic-traffic-os/core/execution-intelligence/execution.service';
import { getProviders as getProvidersFn } from '../../../../../organic-traffic-os/core/execution-intelligence/provider-selector';

export function getExecutionIntelligenceService() {
  return getExecutionService();
}

export function getProviders() {
  return getProvidersFn();
}
