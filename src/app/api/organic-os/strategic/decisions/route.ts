import { getStrategicServiceSingleton } from '../_service-singleton';

export async function GET() {
  const svc = getStrategicServiceSingleton();
  return Response.json({ decisions: svc.getDecisions(), total: svc.getDecisions().length });
}
