export type ExecutionStrategy = 'fast' | 'balanced' | 'premium' | 'low-cost' | 'deep-research' | 'long-context' | 'multi-step';

export type ProviderName = 'openai' | 'anthropic' | 'mistral' | 'google' | 'openrouter';

export interface ProviderConfig {
  name: ProviderName;
  available: boolean;
  models: ModelConfig[];
  costPerInputToken: number;
  costPerOutputToken: number;
}

export interface ModelConfig {
  name: string;
  provider: ProviderName;
  maxTokens: number;
  quality: number;
  speed: number;
  costTier: 'low' | 'medium' | 'high';
}

export interface ExecutionRequest {
  workspaceId: string;
  workflowId?: string;
  agentId?: string;
  objective: string;
  strategy?: ExecutionStrategy;
  budget?: number;
  contextTokens?: number;
}

export interface ExecutionPlan {
  id: string;
  workspaceId: string;
  provider: ProviderName;
  model: string;
  strategy: ExecutionStrategy;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedCost: number;
  maxCost: number;
  estimatedTimeMs: number;
  fallbackProvider?: ProviderName;
  fallbackModel?: string;
  reason: string;
  createdAt: string;
}

export interface ExecutionLog {
  id: string;
  workspaceId: string;
  workflowId?: string;
  provider: ProviderName;
  model: string;
  strategy: ExecutionStrategy;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  duration: number;
  fallbackUsed: boolean;
  fallbackReason?: string;
  errors: string[];
  warnings: string[];
  createdAt: string;
}
