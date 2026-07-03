import { GraphNode, GraphEdge, GraphQuery, GraphQueryResult, NodeType, RelationType } from './graph.types';
import { graphRegistry } from './graph-registry';

export function queryGraph(query: GraphQuery): GraphQueryResult {
  const graph = graphRegistry.getGraph(query.workspaceId);
  if (!graph) return { nodes: [], edges: [], total: 0 };

  let nodes = [...graph.nodes];
  let edges = [...graph.edges];

  if (query.nodeType) {
    nodes = nodes.filter(n => n.type === query.nodeType);
  }

  if (query.relationType) {
    edges = edges.filter(e => e.relation === query.relationType);
    const nodeIds = new Set(edges.flatMap(e => [e.source, e.target]));
    nodes = nodes.filter(n => nodeIds.has(n.id));
  }

  if (query.search) {
    const searchLower = query.search.toLowerCase();
    nodes = nodes.filter(n => n.name.toLowerCase().includes(searchLower) || n.description.toLowerCase().includes(searchLower));
  }

  if (query.limit) {
    nodes = nodes.slice(0, query.limit);
  }

  return { nodes, edges, total: nodes.length };
}

export function findRelatedNodes(workspaceId: string, nodeId: string): GraphNode[] {
  const graph = graphRegistry.getGraph(workspaceId);
  if (!graph) return [];
  const relatedIds = new Set<string>();
  graph.edges.forEach(e => {
    if (e.source === nodeId) relatedIds.add(e.target);
    if (e.target === nodeId) relatedIds.add(e.source);
  });
  return graph.nodes.filter(n => relatedIds.has(n.id));
}

export function findOrphanNodes(workspaceId: string): GraphNode[] {
  const graph = graphRegistry.getGraph(workspaceId);
  if (!graph) return [];
  const connectedIds = new Set(graph.edges.flatMap(e => [e.source, e.target]));
  return graph.nodes.filter(n => !connectedIds.has(n.id));
}

export function findNodesByType(workspaceId: string, type: NodeType): GraphNode[] {
  const graph = graphRegistry.getGraph(workspaceId);
  if (!graph) return [];
  return graph.nodes.filter(n => n.type === type);
}
