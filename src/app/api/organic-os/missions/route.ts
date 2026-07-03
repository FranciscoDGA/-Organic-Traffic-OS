import { getMissionServiceSingleton } from './_service-singleton';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');
  const svc = getMissionServiceSingleton();
  const missions = workspace ? svc.getByWorkspace(workspace) : svc.getAll();
  return Response.json({ missions, total: missions.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { workspaceId, name, description, objective, type, priority, owner, strategy, expectedResult, deadline } = body;
  if (!workspaceId || !name || !objective || !strategy) {
    return Response.json({ error: 'workspaceId, name, objective, strategy required' }, { status: 400 });
  }
  const svc = getMissionServiceSingleton();
  const validation = svc.validate(body);
  if (!validation.valid) return Response.json({ error: validation.errors }, { status: 400 });
  const mission = svc.create({ workspaceId, name, description: description || '', objective, type: type || 'growth', priority: priority || 'medium', status: 'draft', owner: owner || 'CEO', strategy, expectedResult: expectedResult || '', deadline: deadline || '', estimatedDuration: 0, estimatedCost: 0 });
  const plan = svc.plan(mission);
  mission.tasks = plan.tasks;
  mission.estimatedDuration = plan.estimatedDuration;
  mission.estimatedCost = plan.estimatedCost;
  return Response.json({ mission, plan });
}
