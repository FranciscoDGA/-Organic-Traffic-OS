import { getMemoryService } from '../_service-singleton';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');
  const q = searchParams.get('q');
  if (!workspace) return Response.json({ error: 'workspace required' }, { status: 400 });
  const svc = getMemoryService();
  const results = svc.search(workspace, q || '');
  return Response.json({ results, total: results.length });
}
