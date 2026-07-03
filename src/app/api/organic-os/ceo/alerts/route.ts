import { getCEOServiceSingleton } from '../_service-singleton';

export async function GET() {
  const data = getCEOServiceSingleton();
  return Response.json({ alerts: data.alerts, total: data.alerts.length });
}
