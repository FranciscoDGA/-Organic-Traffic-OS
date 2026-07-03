export interface ContextPackage {
  id: string;
  workspaceId: string;
  workflowId?: string;
  agentId?: string;
  engineId?: string;
  objective: string;
  editorialContext: string;
  relevantMemory: string[];
  entities: string[];
  clusters: string[];
  relatedContent: string[];
  faqs: string[];
  personas: string[];
  strategy: string;
  sources: string[];
  restrictions: string[];
  priority: number;
  estimatedTokens: number;
  createdAt: string;
}

export interface ContextRequest {
  workspaceId: string;
  workflowId?: string;
  agentId?: string;
  engineId?: string;
  objective: string;
  maxTokens?: number;
}

export interface ContextSource {
  type: 'workspace' | 'knowledge-core' | 'knowledge-graph' | 'memory' | 'objectives' | 'personas';
  data: string;
  relevance: number;
  confidence: number;
}

export interface RankWeights {
  relevance: number;
  recency: number;
  frequency: number;
  confidence: number;
  authority: number;
  objectiveRelation: number;
}

export interface ContextBuildLog {
  id: string;
  workspaceId: string;
  sourcesUsed: string[];
  estimatedTokens: number;
  discardedTokens: number;
  includedTokens: number;
  warnings: string[];
  failures: string[];
  duration: number;
  createdAt: string;
}
