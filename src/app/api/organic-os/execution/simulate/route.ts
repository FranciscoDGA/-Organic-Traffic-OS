import { getExecutionIntelligenceService } from '../_service-singleton';

export async function POST(request: Request) {
  const body = await request.json();
  const { workspaceId, objective, budget, contextTokens } = body;
  if (!workspaceId || !objective) return Response.json({ error: 'workspaceId and objective required' }, { status: 400 });
  const svc = getExecutionIntelligenceService();
  const results = svc.simulate({ workspaceId, objective, budget, contextTokens });
  return Response.json({ results });
}
