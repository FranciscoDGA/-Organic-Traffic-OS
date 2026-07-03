import { getMemoryService } from './_service-singleton';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');
  if (!workspace) return Response.json({ error: 'workspace required' }, { status: 400 });
  const svc = getMemoryService();
  const memories = svc.getAll(workspace);
  const stats = svc.stats(workspace);
  return Response.json({ memories, stats });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { workspaceId, type, origin, category, title, description, context, result, learning, confidence, tags, entities } = body;
  if (!workspaceId || !title) return Response.json({ error: 'workspaceId and title required' }, { status: 400 });
  const svc = getMemoryService();
  const record = svc.save({ id: `mem-${workspaceId}-${Date.now()}`, workspaceId, type: type || 'operational', origin: origin || 'api', category: category || 'success', title, description: description || '', context: context || '', result: result || '', learning: learning || '', confidence: confidence ?? 0.8, tags: tags || [], entities: entities || [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  return Response.json({ record });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  const svc = getMemoryService();
  const updated = svc.update(id, updates);
  if (!updated) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ record: updated });
}
