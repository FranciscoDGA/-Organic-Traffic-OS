import { getOpportunityServiceSingleton } from '../../_service-singleton';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const svc = getOpportunityServiceSingleton();
  const proposal = svc.getProposals().find(p => p.opportunityId === id || p.id === id);
  if (!proposal) return Response.json({ error: 'Not found' }, { status: 404 });
  const approved = svc.approve(proposal.id);
  return Response.json({ proposal: approved });
}
