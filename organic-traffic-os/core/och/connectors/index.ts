import { ConnectorConfig } from '../connector-types';
import { connectorRegistry } from '../connector-registry';
import { CircuitBreaker, RetryHandler, RateLimiter } from '../resilience';

const CONNECTORS: ConnectorConfig[] = [
  {
    id: 'openai', name: 'OpenAI', provider: 'openai', category: 'ai', version: '1.0.0', status: 'active',
    authentication: { type: 'api_key', envKey: 'OPENAI_API_KEY', header: 'Authorization' },
    permissions: ['chat', 'embeddings', 'images', 'audio'],
    rateLimit: { requestsPerMinute: 60, tokensPerMinute: 150000 },
    retryPolicy: { maxRetries: 3, backoffMs: 1000, maxBackoffMs: 30000 },
    timeout: 60000,
    healthCheck: { enabled: true, intervalMs: 60000 },
  },
  {
    id: 'anthropic', name: 'Anthropic', provider: 'anthropic', category: 'ai', version: '1.0.0', status: 'active',
    authentication: { type: 'api_key', envKey: 'ANTHROPIC_API_KEY', header: 'x-api-key' },
    permissions: ['chat', 'messages'],
    rateLimit: { requestsPerMinute: 40, tokensPerMinute: 100000 },
    retryPolicy: { maxRetries: 3, backoffMs: 1000, maxBackoffMs: 30000 },
    timeout: 60000,
    healthCheck: { enabled: true, intervalMs: 60000 },
  },
  {
    id: 'gemini', name: 'Google Gemini', provider: 'google', category: 'ai', version: '1.0.0', status: 'active',
    authentication: { type: 'api_key', envKey: 'GOOGLE_API_KEY', header: 'Authorization' },
    permissions: ['chat', 'embeddings'],
    rateLimit: { requestsPerMinute: 60, tokensPerMinute: 120000 },
    retryPolicy: { maxRetries: 3, backoffMs: 1000, maxBackoffMs: 30000 },
    timeout: 60000,
    healthCheck: { enabled: true, intervalMs: 60000 },
  },
  {
    id: 'github', name: 'GitHub', provider: 'github', category: 'github', version: '1.0.0', status: 'active',
    authentication: { type: 'token', envKey: 'GITHUB_TOKEN', header: 'Authorization' },
    permissions: ['repos', 'issues', 'pull_requests', 'actions'],
    rateLimit: { requestsPerMinute: 60 },
    retryPolicy: { maxRetries: 3, backoffMs: 1000, maxBackoffMs: 30000 },
    timeout: 30000,
    healthCheck: { enabled: true, intervalMs: 120000 },
  },
  {
    id: 'vercel', name: 'Vercel', provider: 'vercel', category: 'vercel', version: '1.0.0', status: 'active',
    authentication: { type: 'token', envKey: 'VERCEL_TOKEN', header: 'Authorization' },
    permissions: ['deployments', 'projects', 'domains'],
    rateLimit: { requestsPerMinute: 100 },
    retryPolicy: { maxRetries: 3, backoffMs: 1000, maxBackoffMs: 30000 },
    timeout: 30000,
    healthCheck: { enabled: true, intervalMs: 120000 },
  },
  {
    id: 'supabase', name: 'Supabase', provider: 'supabase', category: 'supabase', version: '1.0.0', status: 'active',
    authentication: { type: 'token', envKey: 'SUPABASE_SERVICE_KEY', header: 'Authorization' },
    permissions: ['database', 'storage', 'auth', 'edge_functions'],
    rateLimit: { requestsPerMinute: 200 },
    retryPolicy: { maxRetries: 3, backoffMs: 500, maxBackoffMs: 10000 },
    timeout: 15000,
    healthCheck: { enabled: true, intervalMs: 60000 },
  },
  {
    id: 'organic-bridge', name: 'Organic Bridge', provider: 'organic', category: 'publisher', version: '1.0.0', status: 'active',
    authentication: { type: 'token', envKey: 'PUBLISH_SECRET', header: 'X-Publish-Secret' },
    permissions: ['publish', 'draft', 'preview', 'revalidate'],
    rateLimit: { requestsPerMinute: 30 },
    retryPolicy: { maxRetries: 2, backoffMs: 2000, maxBackoffMs: 30000 },
    timeout: 60000,
    healthCheck: { enabled: true, intervalMs: 120000 },
  },
];

const breakers = new Map<string, CircuitBreaker>();
const retryHandlers = new Map<string, RetryHandler>();
const rateLimiters = new Map<string, RateLimiter>();

export function initializeConnectors(): void {
  for (const config of CONNECTORS) {
    connectorRegistry.register(config);
    breakers.set(config.id, new CircuitBreaker());
    retryHandlers.set(config.id, new RetryHandler(config.retryPolicy.maxRetries, config.retryPolicy.backoffMs, config.retryPolicy.maxBackoffMs));
    rateLimiters.set(config.id, new RateLimiter(config.rateLimit.requestsPerMinute));
  }
}

export function getConnector(id: string) { return connectorRegistry.get(id); }
export function getAllConnectors() { return connectorRegistry.getAll(); }
export function getConnectorBreaker(id: string) { return breakers.get(id); }
export function getConnectorRetry(id: string) { return retryHandlers.get(id); }
export function getConnectorRateLimiter(id: string) { return rateLimiters.get(id); }

initializeConnectors();
