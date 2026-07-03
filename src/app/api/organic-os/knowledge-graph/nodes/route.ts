import { graphService } from '../_service-singleton';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');
  const type = searchParams.get('type') as string | null;

  if (!workspace) return Response.json({ error: 'workspace required' }, { status: 400 });

  const graph = graphService.getGraph(workspace);
  if (!graph) return Response.json({ error: 'Workspace not found' }, { status: 404 });

  const nodes = type ? graph.nodes.filter(n => n.type === type) : graph.nodes;
  return Response.json({ nodes, total: nodes.length });
}
