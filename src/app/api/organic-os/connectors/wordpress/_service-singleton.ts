import { WpService } from '../../../../../../organic-traffic-os/core/connectors/wordpress/wordpress.service';

let serviceInstance: WpService | null = null;

export function getWpService(config?: { site_url: string; username: string; app_password: string }): WpService {
  if (!serviceInstance && config) {
    serviceInstance = new WpService(config);
  }
  if (!serviceInstance) {
    serviceInstance = new WpService({ site_url: '', username: '', app_password: '' });
  }
  return serviceInstance;
}

export function resetWpService(): void {
  serviceInstance = null;
}
