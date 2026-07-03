export type NodeType = 'workspace' | 'content' | 'category' | 'cluster' | 'pillar' | 'entity' | 'faq' | 'source' | 'keyword' | 'persona' | 'objective' | 'product' | 'service' | 'workflow' | 'agent' | 'connector' | 'engine';

export type RelationType = 'PERTENCE_A' | 'RELACIONADO_A' | 'DEPENDE_DE' | 'RESPONDE' | 'REFERENCIA' | 'UTILIZA' | 'EXPANDE' | 'CONTRADIZ' | 'ATUALIZA' | 'SUBSTITUI' | 'PERTENCE_AO_CLUSTER' | 'DERIVA_DE';

export interface GraphNode {
  id: string;
  workspaceId: string;
  type: NodeType;
  name: string;
  description: string;
  properties: Record<string, string | number | boolean>;
  createdAt: string;
}

export interface GraphEdge {
  id: string;
  workspaceId: string;
  source: string;
  target: string;
  relation: RelationType;
  weight: number;
  properties: Record<string, string | number | boolean>;
  createdAt: string;
}

export interface KnowledgeGraph {
  workspaceId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: GraphStats;
  lastUpdated: string;
}

export interface GraphStats {
  totalNodes: number;
  totalEdges: number;
  nodesByType: Record<NodeType, number>;
  edgesByRelation: Record<RelationType, number>;
  orphans: number;
}

export interface GraphQuery {
  workspaceId: string;
  nodeType?: NodeType;
  relationType?: RelationType;
  search?: string;
  limit?: number;
}

export interface GraphQueryResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  total: number;
}
