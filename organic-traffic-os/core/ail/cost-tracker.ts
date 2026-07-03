import { CostRecord } from './ai-intelligence.types';

class CostTracker {
  private records: CostRecord[] = [];
  private counter = 0;

  record(data: Omit<CostRecord, 'id' | 'timestamp' | 'estimatedCost'>): CostRecord {
    const cost = (data.inputTokens * 0.001 * 0.01) + (data.outputTokens * 0.001 * 0.03);
    const record: CostRecord = {
      id: `cost-${Date.now()}-${++this.counter}`,
      timestamp: new Date().toISOString(),
      ...data,
      estimatedCost: cost,
    };
    this.records.push(record);
    return record;
  }

  getByWorkspace(workspaceId: string): CostRecord[] {
    return this.records.filter(r => r.workspaceId === workspaceId);
  }

  getByProvider(providerId: string): CostRecord[] {
    return this.records.filter(r => r.providerId === providerId);
  }

  getTotalCost(): number {
    return this.records.reduce((sum, r) => sum + r.estimatedCost, 0);
  }

  getDailyCost(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.records.filter(r => r.timestamp.startsWith(today)).reduce((sum, r) => sum + r.estimatedCost, 0);
  }

  getMonthlyCost(): number {
    const month = new Date().toISOString().slice(0, 7);
    return this.records.filter(r => r.timestamp.startsWith(month)).reduce((sum, r) => sum + r.estimatedCost, 0);
  }

  getCostByProvider(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const r of this.records) {
      result[r.providerId] = (result[r.providerId] || 0) + r.estimatedCost;
    }
    return result;
  }

  getCostByWorkspace(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const r of this.records) {
      if (r.workspaceId) result[r.workspaceId] = (result[r.workspaceId] || 0) + r.estimatedCost;
    }
    return result;
  }

  getRecent(count: number): CostRecord[] {
    return this.records.slice(-count);
  }

  getStats() {
    return {
      totalCost: this.getTotalCost(),
      dailyCost: this.getDailyCost(),
      monthlyCost: this.getMonthlyCost(),
      totalRecords: this.records.length,
      byProvider: this.getCostByProvider(),
      byWorkspace: this.getCostByWorkspace(),
    };
  }
}

export const costTracker = new CostTracker();
