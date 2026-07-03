import { getContextIntelligenceService } from './_service-singleton';

export async function POST(request: Request) {
  const body = await request.json();
  const { workspaceId, workflowId, agentId, engineId, objective, maxTokens } = body;
  if (!workspaceId || !objective) return Response.json({ error: 'workspaceId and objective required' }, { status: 400 });
  const svc = getContextIntelligenceService();
  const pkg = svc.build({ workspaceId, workflowId, agentId, engineId, objective }, maxTokens);
  return Response.json({ package: pkg });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');
  if (!workspace) return Response.json({ error: 'workspace required' }, { status: 400 });
  const svc = getContextIntelligenceService();
  const logs = svc.getLogs(workspace);
  return Response.json({ logs, total: logs.length });
}
