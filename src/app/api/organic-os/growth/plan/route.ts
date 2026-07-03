import { getGrowthServiceSingleton } from '../_service-singleton';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');
  if (!workspace) return Response.json({ error: 'workspace required' }, { status: 400 });
  const svc = getGrowthServiceSingleton();
  const plan = svc.getPlan(workspace);
  return Response.json({ plan });
}
