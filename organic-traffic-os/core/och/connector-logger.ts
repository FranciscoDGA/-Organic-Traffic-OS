import { ConnectorLog } from './connector-types';

class ConnectorLogger {
  private logs: ConnectorLog[] = [];
  private maxLogs = 1000;

  log(entry: Omit<ConnectorLog, 'id' | 'timestamp'>): ConnectorLog {
    const full: ConnectorLog = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(full);
    if (this.logs.length > this.maxLogs) this.logs.length = this.maxLogs;
    return full;
  }

  getRecent(limit = 20): ConnectorLog[] { return this.logs.slice(0, limit); }
  getByConnector(connectorId: string): ConnectorLog[] { return this.logs.filter(l => l.connectorId === connectorId); }
  getByWorkspace(workspaceId: string): ConnectorLog[] { return this.logs.filter(l => l.workspaceId === workspaceId); }
  getErrors(): ConnectorLog[] { return this.logs.filter(l => !l.success); }
  size(): number { return this.logs.length; }
  clear(): void { this.logs = []; }
}

export const connectorLogger = new ConnectorLogger();
