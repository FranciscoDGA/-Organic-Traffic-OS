export interface VersionRecord {
  id: string;
  entityType: string;
  entityId: string;
  version: number;
  data: Record<string, unknown>;
  changeNotes?: string;
  createdBy?: string;
  createdAt: string;
}

class VersionStore {
  private versions: Map<string, VersionRecord[]> = new Map();

  create(entityType: string, entityId: string, data: Record<string, unknown>, changeNotes?: string, createdBy?: string): VersionRecord {
    const key = `${entityType}:${entityId}`;
    const existing = this.versions.get(key) || [];
    const version: VersionRecord = {
      id: `ver-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      entityType,
      entityId,
      version: existing.length + 1,
      data,
      changeNotes,
      createdBy,
      createdAt: new Date().toISOString(),
    };
    existing.push(version);
    this.versions.set(key, existing);
    return version;
  }

  getHistory(entityType: string, entityId: string): VersionRecord[] {
    return this.versions.get(`${entityType}:${entityId}`) || [];
  }

  getLatest(entityType: string, entityId: string): VersionRecord | undefined {
    const history = this.getHistory(entityType, entityId);
    return history[history.length - 1];
  }

  getVersion(entityType: string, entityId: string, version: number): VersionRecord | undefined {
    return this.getHistory(entityType, entityId).find(v => v.version === version);
  }

  size(): number {
    let total = 0;
    for (const versions of this.versions.values()) {
      total += versions.length;
    }
    return total;
  }
}

export const versionStore = new VersionStore();
