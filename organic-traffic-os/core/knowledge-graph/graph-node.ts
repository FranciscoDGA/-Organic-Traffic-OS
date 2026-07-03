import { GraphNode, NodeType } from './graph.types';

let nodeCounter = 0;

export function createNode(workspaceId: string, type: NodeType, name: string, description: string, properties: Record<string, string | number | boolean> = {}): GraphNode {
  return {
    id: `node-${workspaceId}-${type}-${++nodeCounter}`,
    workspaceId,
    type,
    name,
    description,
    properties,
    createdAt: new Date().toISOString(),
  };
}
