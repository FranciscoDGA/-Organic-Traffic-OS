import { KnowledgeGraph } from './graph.types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateGraph(graph: KnowledgeGraph): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const nodeIds = new Set(graph.nodes.map(n => n.id));
  const crossWsEdges = graph.edges.filter(e => e.workspaceId !== graph.workspaceId);
  if (crossWsEdges.length > 0) {
    errors.push(`${crossWsEdges.length} edges belong to different workspace`);
  }

  const invalidRefs = graph.edges.filter(e => !nodeIds.has(e.source) || !nodeIds.has(e.target));
  if (invalidRefs.length > 0) {
    errors.push(`${invalidRefs.length} edges reference non-existent nodes`);
  }

  const cycles = detectCycles(graph);
  if (cycles.length > 0) {
    warnings.push(`${cycles.length} cycles detected`);
  }

  const connectedIds = new Set(graph.edges.flatMap(e => [e.source, e.target]));
  const orphans = graph.nodes.filter(n => !connectedIds.has(n.id));
  if (orphans.length > 0) {
    warnings.push(`${orphans.length} orphan nodes`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

function detectCycles(graph: KnowledgeGraph): string[][] {
  const cycles: string[][] = [];
  const adjacency = new Map<string, string[]>();
  graph.edges.forEach(e => {
    if (!adjacency.has(e.source)) adjacency.set(e.source, []);
    adjacency.get(e.source)!.push(e.target);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(node: string, path: string[]): void {
    visited.add(node);
    recursionStack.add(node);
    for (const neighbor of adjacency.get(node) || []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, [...path, neighbor]);
      } else if (recursionStack.has(neighbor)) {
        const cycleStart = path.indexOf(neighbor);
        if (cycleStart >= 0) {
          cycles.push(path.slice(cycleStart));
        }
      }
    }
    recursionStack.delete(node);
  }

  graph.nodes.forEach(n => {
    if (!visited.has(n.id)) dfs(n.id, [n.id]);
  });

  return cycles;
}
