import { KnowledgeGraph, GraphQuery, GraphQueryResult } from './graph.types';
import { graphRegistry } from './graph-registry';
import { queryGraph, findRelatedNodes, findOrphanNodes, findNodesByType } from './graph-query';

class GraphService {
  private registry = graphRegistry;

  getGraph(workspaceId: string): KnowledgeGraph | undefined {
    return this.registry.getGraph(workspaceId);
  }

  getAllGraphs(): KnowledgeGraph[] {
    return this.registry.getAllGraphs();
  }

  query(query: GraphQuery): GraphQueryResult {
    return queryGraph(query);
  }

  getRelated(workspaceId: string, nodeId: string) {
    return findRelatedNodes(workspaceId, nodeId);
  }

  getOrphans(workspaceId: string) {
    return findOrphanNodes(workspaceId);
  }

  getByType(workspaceId: string, type: import('./graph.types').NodeType) {
    return findNodesByType(workspaceId, type);
  }

  rebuild(workspaceId: string) {
    return this.registry.rebuildGraph(workspaceId);
  }
}

export const graphService = new GraphService();
