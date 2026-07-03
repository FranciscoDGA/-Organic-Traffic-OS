import { BwService } from '../../../../../../organic-traffic-os/core/connectors/bing-webmaster/bing-webmaster.service';

let bwService: BwService | null = null;

export function getBwService(): BwService {
  if (!bwService) {
    bwService = new BwService();
  }
  return bwService;
}
