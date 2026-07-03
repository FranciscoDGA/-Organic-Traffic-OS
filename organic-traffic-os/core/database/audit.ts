export interface AuditLogEntry {
  id: string;
  tableName: string;
  recordId?: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  workspaceId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AuditQuery {
  tableName?: string;
  action?: string;
  workspaceId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

class AuditStore {
  private logs: AuditLogEntry[] = [];
  private maxLogs = 10000;

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const full: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(full);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    return full;
  }

  query(q: AuditQuery): AuditLogEntry[] {
    let results = [...this.logs];
    if (q.tableName) results = results.filter(l => l.tableName === q.tableName);
    if (q.action) results = results.filter(l => l.action === q.action);
    if (q.workspaceId) results = results.filter(l => l.workspaceId === q.workspaceId);
    if (q.userId) results = results.filter(l => l.userId === q.userId);
    if (q.startDate) results = results.filter(l => l.timestamp >= q.startDate!);
    if (q.endDate) results = results.filter(l => l.timestamp <= q.endDate!);
    return results.slice(0, q.limit || 100);
  }

  getRecent(limit = 20): AuditLogEntry[] {
    return this.logs.slice(0, limit);
  }

  getByTable(tableName: string): AuditLogEntry[] {
    return this.logs.filter(l => l.tableName === tableName);
  }

  size(): number {
    return this.logs.length;
  }
}

export const auditStore = new AuditStore();
