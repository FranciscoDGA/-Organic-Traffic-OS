import { getStrategicServiceSingleton } from '../_service-singleton';

export async function POST() {
  const svc = getStrategicServiceSingleton();
  const result = svc.analyze();
  return Response.json({ supervisions: result.supervisions, highRisk: result.highRisk });
}
