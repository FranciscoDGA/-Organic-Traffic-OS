import { Ga4Service } from '../../../../../../organic-traffic-os/core/connectors/google-analytics-4/google-analytics-4.service';

let ga4Service: Ga4Service | null = null;

export function getGa4Service(): Ga4Service {
  if (!ga4Service) {
    ga4Service = new Ga4Service();
  }
  return ga4Service;
}
