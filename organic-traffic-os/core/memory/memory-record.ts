import { MemoryRecord, MemoryType, MemoryCategory } from './memory.types';

let counter = 0;

export function createMemoryRecord(params: {
  workspaceId: string;
  type: MemoryType;
  origin: string;
  category: MemoryCategory;
  title: string;
  description: string;
  context: string;
  result: string;
  learning: string;
  confidence?: number;
  tags?: string[];
  entities?: string[];
  workflowId?: string;
  agentId?: string;
  engineId?: string;
  connectorId?: string;
}): MemoryRecord {
  const now = new Date().toISOString();
  return {
    id: `mem-${params.workspaceId}-${++counter}`,
    workspaceId: params.workspaceId,
    type: params.type,
    origin: params.origin,
    category: params.category,
    title: params.title,
    description: params.description,
    context: params.context,
    result: params.result,
    learning: params.learning,
    confidence: params.confidence ?? 0.8,
    tags: params.tags ?? [],
    entities: params.entities ?? [],
    workflowId: params.workflowId,
    agentId: params.agentId,
    engineId: params.engineId,
    connectorId: params.connectorId,
    createdAt: now,
    updatedAt: now,
  };
}
