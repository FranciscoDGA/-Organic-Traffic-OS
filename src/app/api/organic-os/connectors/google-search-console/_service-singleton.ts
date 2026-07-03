import { GscService } from '../../../../../../organic-traffic-os/core/connectors/google-search-console/google-search-console.service';

let gscService: GscService | null = null;

export function getGscService(): GscService {
  if (!gscService) {
    gscService = new GscService();
  }
  return gscService;
}
