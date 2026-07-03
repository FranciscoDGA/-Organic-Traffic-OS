import { getGrowthServiceSingleton } from '../_service-singleton';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');
  if (!workspace) return Response.json({ error: 'workspace required' }, { status: 400 });
  const svc = getGrowthServiceSingleton();
  const actions = svc.getActions(workspace);
  return Response.json({ actions, total: actions.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { actionId, action, reason } = body;
  if (!actionId) return Response.json({ error: 'actionId required' }, { status: 400 });
  const svc = getGrowthServiceSingleton();
  if (action === 'approve') { const a = svc.approve(actionId); return Response.json({ action: a }); }
  if (action === 'reject') { const a = svc.reject(actionId, reason || ''); return Response.json({ action: a }); }
  return Response.json({ error: 'Invalid action' }, { status: 400 });
}
