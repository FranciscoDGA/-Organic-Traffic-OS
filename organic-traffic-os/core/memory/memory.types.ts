export type MemoryType = 'operational' | 'editorial' | 'workflow' | 'agent' | 'engine' | 'publishing' | 'monitoring' | 'learning';

export type MemoryCategory = 'success' | 'error' | 'warning' | 'decision' | 'pattern' | 'insight' | 'rule' | 'preference';

export interface MemoryRecord {
  id: string;
  workspaceId: string;
  type: MemoryType;
  origin: string;
  category: MemoryCategory;
  title: string;
  description: string;
  context: string;
  result: string;
  learning: string;
  confidence: number;
  tags: string[];
  entities: string[];
  workflowId?: string;
  agentId?: string;
  engineId?: string;
  connectorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryQuery {
  workspaceId: string;
  type?: MemoryType;
  category?: MemoryCategory;
  tags?: string[];
  search?: string;
  limit?: number;
  offset?: number;
}

export interface MemoryQueryResult {
  records: MemoryRecord[];
  total: number;
}

export interface MemoryStats {
  totalRecords: number;
  byType: Record<MemoryType, number>;
  byCategory: Record<MemoryCategory, number>;
  avgConfidence: number;
}
