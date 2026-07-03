import { graphService } from './graph-service';
import { graphRegistry } from './graph-registry';

export function initialize(): void {
  graphRegistry.getAllGraphs();
}

export { graphService } from './graph-service';
export { graphRegistry } from './graph-registry';
export { queryGraph, findRelatedNodes, findOrphanNodes, findNodesByType } from './graph-query';
export { validateGraph } from './graph-validator';
export type { KnowledgeGraph, GraphNode, GraphEdge, GraphStats, GraphQuery, GraphQueryResult, NodeType, RelationType } from './graph.types';

initialize();
