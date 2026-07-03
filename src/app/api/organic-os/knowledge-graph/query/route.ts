import { graphService } from '../_service-singleton';

export async function POST(request: Request) {
  const body = await request.json();
  const { workspace, query } = body;

  if (!workspace) return Response.json({ error: 'workspace required' }, { status: 400 });

  const graph = graphService.getGraph(workspace);
  if (!graph) return Response.json({ error: 'Workspace not found' }, { status: 404 });

  const result = graphService.query({ workspaceId: workspace, ...query });
  return Response.json({ result });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');
  const q = searchParams.get('q');

  if (!workspace) return Response.json({ error: 'workspace required' }, { status: 400 });

  const graph = graphService.getGraph(workspace);
  if (!graph) return Response.json({ error: 'Workspace not found' }, { status: 404 });

  if (q === 'orphans') {
    const orphans = graphService.getOrphans(workspace);
    return Response.json({ orphans, total: orphans.length });
  }

  return Response.json({ message: 'Use POST for complex queries or ?q=orphans for orphans' });
}
