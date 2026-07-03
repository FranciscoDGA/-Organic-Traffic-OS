import { CollectorResult } from './collector';
import { CollectorQueue } from './collector-queue';

export class CollectorManager {
  static async executeCollector(collectorId: string, params?: any): Promise<CollectorResult> {
    return CollectorQueue.enqueue(collectorId, params);
  }

  static async monitorFailures() {
    // In future this will integrate with the logging system
    console.log('[Collector Manager] Monitoring for failures...');
  }
}
