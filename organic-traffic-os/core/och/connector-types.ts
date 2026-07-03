export type ConnectorCategory = 'ai' | 'google' | 'github' | 'vercel' | 'supabase' | 'communication' | 'publisher';

export type ConnectorStatus = 'active' | 'inactive' | 'error' | 'rate_limited' | 'circuit_open';

export interface ConnectorConfig {
  id: string;
  name: string;
  provider: string;
  category: ConnectorCategory;
  version: string;
  status: ConnectorStatus;
  authentication: {
    type: 'api_key' | 'oauth2' | 'token' | 'basic';
    envKey: string;
    header?: string;
  };
  permissions: string[];
  rateLimit: {
    requestsPerMinute: number;
    tokensPerMinute?: number;
  };
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
    maxBackoffMs: number;
  };
  timeout: number;
  healthCheck: {
    enabled: boolean;
    intervalMs: number;
    lastCheck?: string;
    status?: string;
    latencyMs?: number;
    lastError?: string;
  };
}

export interface ConnectorLog {
  id: string;
  connectorId: string;
  workspaceId?: string;
  agentId?: string;
  action: string;
  durationMs: number;
  tokens?: number;
  cost?: number;
  success: boolean;
  error?: string;
  retries: number;
  timestamp: string;
}

export interface ConnectorHealthStatus {
  connectorId: string;
  status: ConnectorStatus;
  latencyMs: number;
  lastCheck: string;
  lastError?: string;
  availability: number;
  totalCalls: number;
  successRate: number;
}

export interface ConnectorTestResult {
  connectorId: string;
  success: boolean;
  latencyMs: number;
  message: string;
  timestamp: string;
}
