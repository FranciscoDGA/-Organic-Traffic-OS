import { getRuntimeService as getRuntimeServiceInternal } from '../../../../../organic-traffic-os/core/runtime/runtime.service';

let serviceInstance: ReturnType<typeof getRuntimeServiceInternal> | null = null;

export function getRuntimeService() {
  if (!serviceInstance) {
    serviceInstance = getRuntimeServiceInternal();
  }
  return serviceInstance;
}
