import { getMissionProgressServiceSingleton } from '../_service-singleton';

export async function GET() {
  const svc = getMissionProgressServiceSingleton();
  return Response.json({ kpis: svc.getKPIs(), total: svc.getKPIs().length });
}
