import { getMemoryService } from '../_service-singleton';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');
  if (!workspace) return Response.json({ error: 'workspace required' }, { status: 400 });
  const svc = getMemoryService();
  const memories = svc.rank(workspace);
  return Response.json({ memories, total: memories.length });
}
