import { GraphEdge, RelationType } from './graph.types';

let edgeCounter = 0;

export function createEdge(workspaceId: string, source: string, target: string, relation: RelationType, weight: number = 1, properties: Record<string, string | number | boolean> = {}): GraphEdge {
  return {
    id: `edge-${workspaceId}-${++edgeCounter}`,
    workspaceId,
    source,
    target,
    relation,
    weight,
    properties,
    createdAt: new Date().toISOString(),
  };
}
