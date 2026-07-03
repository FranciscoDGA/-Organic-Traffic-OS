import { getStrategicServiceSingleton } from '../_service-singleton';

export async function GET() {
  const svc = getStrategicServiceSingleton();
  return Response.json({ recommendations: svc.getRecommendations() });
}
