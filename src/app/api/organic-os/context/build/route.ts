import { getContextIntelligenceService } from '../_service-singleton';

export async function POST(request: Request) {
  const body = await request.json();
  const { workspaceId, objective, maxTokens } = body;
  if (!workspaceId || !objective) return Response.json({ error: 'workspaceId and objective required' }, { status: 400 });
  const svc = getContextIntelligenceService();
  const pkg = svc.build({ workspaceId, objective }, maxTokens);
  return Response.json({ package: pkg });
}
