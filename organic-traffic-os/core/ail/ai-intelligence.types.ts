export type ProviderStatus = 'active' | 'inactive' | 'rate_limited' | 'error';
export type TaskProfile = 'research' | 'planning' | 'writing' | 'editorial_review' | 'qa' | 'seo' | 'ai_visibility' | 'title_generation' | 'faq_generation' | 'schema_generation' | 'data_analysis' | 'executive_summary';

export interface AIModel {
  id: string;
  name: string;
  maxTokens: number;
  inputCostPer1k: number;
  outputCostPer1k: number;
  supportsStreaming: boolean;
}

export interface AIProvider {
  id: string;
  name: string;
  status: ProviderStatus;
  models: AIModel[];
  requestLimit: number;
  tokenLimit: number;
  timeout: number;
  priority: number;
  fallbackProviderId?: string;
  apiKeyEnv: string;
}

export interface TaskProfileConfig {
  id: TaskProfile;
  name: string;
  preferredProviderId: string;
  preferredModelId: string;
  fallbackProviderId: string;
  fallbackModelId: string;
  maxTokens: number;
  temperature: number;
}

export interface CostRecord {
  id: string;
  timestamp: string;
  workspaceId?: string;
  agentId?: string;
  missionId?: string;
  workflowId?: string;
  providerId: string;
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
}

export interface ProviderHealth {
  providerId: string;
  available: boolean;
  latencyMs: number;
  remainingRequests: number;
  remainingTokens: number;
  recentFailures: number;
  lastChecked: string;
}

export interface CacheEntry {
  key: string;
  response: unknown;
  expiresAt: string;
}
