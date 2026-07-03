import { ConnectorConfig, ConnectorStatus, ConnectorHealthStatus } from './connector-types';

class ConnectorRegistry {
  private connectors: Map<string, ConnectorConfig> = new Map();
  private healthHistory: Map<string, ConnectorHealthStatus[]> = new Map();

  register(config: ConnectorConfig): void {
    this.connectors.set(config.id, config);
  }

  get(id: string): ConnectorConfig | undefined {
    return this.connectors.get(id);
  }

  getAll(): ConnectorConfig[] {
    return Array.from(this.connectors.values());
  }

  getByCategory(category: string): ConnectorConfig[] {
    return this.getAll().filter(c => c.category === category);
  }

  getActive(): ConnectorConfig[] {
    return this.getAll().filter(c => c.status === 'active');
  }

  getHealthy(): ConnectorConfig[] {
    return this.getAll().filter(c => c.status === 'active' && !c.healthCheck.lastError);
  }

  updateStatus(id: string, status: ConnectorStatus): void {
    const conn = this.connectors.get(id);
    if (conn) conn.status = status;
  }

  updateHealth(id: string, health: Partial<ConnectorHealthStatus>): void {
    const conn = this.connectors.get(id);
    if (!conn) return;
    conn.healthCheck.lastCheck = new Date().toISOString();
    if (health.status) conn.status = health.status;
    if (health.latencyMs) conn.healthCheck.latencyMs = health.latencyMs;
    if (health.lastError !== undefined) conn.healthCheck.lastError = health.lastError;
    const history = this.healthHistory.get(id) || [];
    history.unshift({ connectorId: id, status: conn.status, latencyMs: health.latencyMs || 0, lastCheck: conn.healthCheck.lastCheck, lastError: health.lastError, availability: health.availability || 100, totalCalls: health.totalCalls || 0, successRate: health.successRate || 100 });
    if (history.length > 100) history.length = 100;
    this.healthHistory.set(id, history);
  }

  getHealthHistory(id: string): ConnectorHealthStatus[] {
    return this.healthHistory.get(id) || [];
  }

  size(): number {
    return this.connectors.size;
  }
}

export const connectorRegistry = new ConnectorRegistry();
