import { getMissionProgressServiceSingleton } from '../_service-singleton';

export async function GET() {
  const svc = getMissionProgressServiceSingleton();
  return Response.json({ alerts: svc.getAllAlerts() });
}
