import { getOpportunityServiceSingleton } from '../_service-singleton';

export async function GET() {
  const svc = getOpportunityServiceSingleton();
  return Response.json({ proposals: svc.getProposals(), total: svc.getProposals().length });
}
