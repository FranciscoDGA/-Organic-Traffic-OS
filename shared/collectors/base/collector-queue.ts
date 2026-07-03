import { CollectorRegistry } from './collector-registry';
import { CollectorResult } from './collector';

// Simulating a queue system. In production, this ties into the task-queue.ts or bullmq
export class CollectorQueue {
  static async enqueue(collectorId: string, params?: any): Promise<CollectorResult> {
    const collector = CollectorRegistry.get(collectorId);
    
    if (!collector) {
      throw new Error(`Collector ${collectorId} not found in Registry.`);
    }

    // In a real queue, this would return a Job ID and run in background.
    // Here we run inline for the MVP.
    return await collector.run(params);
  }
}
