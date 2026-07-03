import { getOpportunityServiceSingleton } from '../_service-singleton';

export async function GET() {
  const svc = getOpportunityServiceSingleton();
  return Response.json({ ranking: svc.getRanking() });
}
