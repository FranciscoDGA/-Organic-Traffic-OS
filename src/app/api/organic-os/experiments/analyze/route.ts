import { getExperimentServiceSingleton } from '../_service-singleton';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  const svc = getExperimentServiceSingleton();
  const experiment = svc.getById(id);
  if (!experiment) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ experiment });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { id, action, name, description, changes } = body;
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  const svc = getExperimentServiceSingleton();

  if (action === 'start') { const r = svc.start(id); return Response.json(r); }
  if (action === 'pause') { const r = svc.pause(id); return Response.json(r); }
  if (action === 'stop') { const r = svc.stop(id); return Response.json(r); }
  if (action === 'addVariant') { const r = svc.addVariant(id, name || '', description || '', changes || ''); return Response.json(r); }
  if (action === 'analyze') { const r = svc.analyze(id); return Response.json(r); }

  return Response.json({ error: 'Invalid action' }, { status: 400 });
}
