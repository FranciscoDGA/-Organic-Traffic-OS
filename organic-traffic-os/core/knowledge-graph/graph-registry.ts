import { KnowledgeGraph } from './graph.types';
import { buildPassaCumaruGraph, buildGarimpeiBrasilGraph } from './graph-builder';

class GraphRegistry {
  private graphs: Map<string, KnowledgeGraph> = new Map();

  constructor() {
    this.graphs.set('passacumaru', buildPassaCumaruGraph());
    this.graphs.set('garimpeibrasil', buildGarimpeiBrasilGraph());
  }

  getGraph(workspaceId: string): KnowledgeGraph | undefined {
    return this.graphs.get(workspaceId);
  }

  getAllGraphs(): KnowledgeGraph[] {
    return Array.from(this.graphs.values());
  }

  rebuildGraph(workspaceId: string): KnowledgeGraph | undefined {
    if (workspaceId === 'passacumaru') {
      const g = buildPassaCumaruGraph();
      this.graphs.set(workspaceId, g);
      return g;
    }
    if (workspaceId === 'garimpeibrasil') {
      const g = buildGarimpeiBrasilGraph();
      this.graphs.set(workspaceId, g);
      return g;
    }
    return undefined;
  }
}

export const graphRegistry = new GraphRegistry();
