import { getAutoLearningServiceSingleton } from '../_service-singleton';

export async function POST(request: Request) {
  const body = await request.json();
  const { workspaceId, data } = body;
  if (!workspaceId) return Response.json({ error: 'workspaceId required' }, { status: 400 });
  const svc = getAutoLearningServiceSingleton();
  const report = svc.generateReport(workspaceId);
  return Response.json({ report });
}
