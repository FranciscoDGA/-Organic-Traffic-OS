import { HeadlessCmsService } from '../../../../../../organic-traffic-os/core/connectors/headless-cms/headless-cms.service';

let serviceInstance: HeadlessCmsService | null = null;

export function getHeadlessCmsService(config?: { provider: any; api_url: string; api_token: string; project_id?: string }): HeadlessCmsService {
  if (!serviceInstance && config) {
    serviceInstance = new HeadlessCmsService(config);
  }
  if (!serviceInstance) {
    serviceInstance = new HeadlessCmsService({ provider: 'mock', api_url: '', api_token: '' });
  }
  return serviceInstance;
}

export function resetHeadlessCmsService(): void {
  serviceInstance = null;
}
