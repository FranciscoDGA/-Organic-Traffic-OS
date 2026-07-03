import { getMissionServiceSingleton } from '../../_service-singleton';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const svc = getMissionServiceSingleton();
  const mission = svc.getById(id);
  if (!mission) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ mission: svc.resume(mission) });
}
