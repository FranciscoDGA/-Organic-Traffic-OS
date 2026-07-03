import { GtService } from '../../../../../../organic-traffic-os/core/connectors/google-trends/google-trends.service';

let gtService: GtService | null = null;

export function getGtService(): GtService {
  if (!gtService) {
    gtService = new GtService();
  }
  return gtService;
}
