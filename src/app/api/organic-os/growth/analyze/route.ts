import { getGrowthServiceSingleton } from '../_service-singleton';

export async function POST(request: Request) {
  const body = await request.json();
  const { workspaceId } = body;
  if (!workspaceId) return Response.json({ error: 'workspaceId required' }, { status: 400 });
  const svc = getGrowthServiceSingleton();
  const plan = svc.analyze(workspaceId);
  return Response.json({ plan });
}
