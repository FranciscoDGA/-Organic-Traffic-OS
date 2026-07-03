import { getOpportunityServiceSingleton } from '../_service-singleton';

export async function POST() {
  const svc = getOpportunityServiceSingleton();
  const result = svc.analyzeAndPropose();
  return Response.json(result);
}
