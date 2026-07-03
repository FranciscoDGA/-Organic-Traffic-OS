import { getExperimentServiceSingleton } from './_service-singleton';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');
  if (!workspace) return Response.json({ error: 'workspace required' }, { status: 400 });
  const svc = getExperimentServiceSingleton();
  const experiments = svc.getAll(workspace);
  return Response.json({ experiments, total: experiments.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { workspaceId, name, hypothesis, type, primaryMetric, secondaryMetrics } = body;
  if (!workspaceId || !name || !hypothesis) return Response.json({ error: 'workspaceId, name and hypothesis required' }, { status: 400 });
  const svc = getExperimentServiceSingleton();
  const result = svc.create({ workspaceId, name, hypothesis, type, primaryMetric, secondaryMetrics });
  if ('error' in result) return Response.json(result, { status: 400 });
  return Response.json(result);
}
