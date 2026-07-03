import { ConnectorConfig, ConnectorTestResult, ConnectorHealthStatus } from './connector-types';
import { connectorRegistry } from './connector-registry';
import { connectorLogger } from './connector-logger';
import { getConnectorBreaker, getConnectorRetry, getConnectorRateLimiter } from './connectors';

export class ConnectorHub {
  async call(connectorId: string, action: string, params: Record<string, unknown> = {}, workspaceId?: string, agentId?: string): Promise<unknown> {
    const connector = connectorRegistry.get(connectorId);
    if (!connector) throw new Error(`Connector ${connectorId} not found`);
    if (connector.status !== 'active') throw new Error(`Connector ${connectorId} is ${connector.status}`);

    const breaker = getConnectorBreaker(connectorId);
    const retry = getConnectorRetry(connectorId);
    const limiter = getConnectorRateLimiter(connectorId);
    if (limiter) await limiter.acquire();

    const startTime = Date.now();
    let retries = 0;
    let lastError: string | undefined;

    try {
      const result = await (breaker && retry
        ? breaker.execute(() => retry.execute(async () => {
            await new Promise(r => setTimeout(r, 50 + Math.random() * 100));
            return { success: true, action, connector: connectorId, data: params };
          }))
        : new Promise(resolve => setTimeout(() => resolve({ success: true, action, connector: connectorId, data: params }), 50))
      );

      const duration = Date.now() - startTime;
      connectorLogger.log({ connectorId, workspaceId, agentId, action, durationMs: duration, success: true, retries });
      return result;
    } catch (err) {
      lastError = (err as Error).message;
      const duration = Date.now() - startTime;
      connectorLogger.log({ connectorId, workspaceId, agentId, action, durationMs: duration, success: false, error: lastError, retries });
      throw err;
    }
  }

  async test(connectorId: string): Promise<ConnectorTestResult> {
    const connector = connectorRegistry.get(connectorId);
    if (!connector) return { connectorId, success: false, latencyMs: 0, message: 'Connector not found', timestamp: new Date().toISOString() };
    const start = Date.now();
    try {
      await this.call(connectorId, 'health_check');
      return { connectorId, success: true, latencyMs: Date.now() - start, message: 'Connection successful', timestamp: new Date().toISOString() };
    } catch (err) {
      return { connectorId, success: false, latencyMs: Date.now() - start, message: (err as Error).message, timestamp: new Date().toISOString() };
    }
  }

  async healthCheckAll(): Promise<ConnectorHealthStatus[]> {
    const connectors = connectorRegistry.getAll();
    const results: ConnectorHealthStatus[] = [];
    for (const conn of connectors) {
      const result = await this.test(conn.id);
      const status = result.success ? 'active' as const : 'error' as const;
      connectorRegistry.updateHealth(conn.id, { status, latencyMs: result.latencyMs, lastError: result.message, availability: result.success ? 100 : 0, totalCalls: 1, successRate: result.success ? 100 : 0 });
      results.push({ connectorId: conn.id, status, latencyMs: result.latencyMs, lastCheck: new Date().toISOString(), lastError: result.success ? undefined : result.message, availability: result.success ? 100 : 0, totalCalls: 1, successRate: result.success ? 100 : 0 });
    }
    return results;
  }

  async reconnect(connectorId: string): Promise<boolean> {
    const breaker = getConnectorBreaker(connectorId);
    if (breaker) { breaker.reset(); return true; }
    return false;
  }

  getConnector(id: string) { return connectorRegistry.get(id); }
  getAllConnectors() { return connectorRegistry.getAll(); }
  getLogs(limit = 20) { return connectorLogger.getRecent(limit); }
}

export const connectorHub = new ConnectorHub();
