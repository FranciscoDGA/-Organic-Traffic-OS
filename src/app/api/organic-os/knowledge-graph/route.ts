import { graphService, validateGraph } from './_service-singleton';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');

  if (!workspace) {
    const graphs = graphService.getAllGraphs();
    return Response.json({ graphs, total: graphs.length });
  }

  const graph = graphService.getGraph(workspace);
  if (!graph) return Response.json({ error: 'Workspace not found' }, { status: 404 });

  const validation = validateGraph(graph);
  return Response.json({ graph, validation });
}
