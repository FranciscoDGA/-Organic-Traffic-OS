import { QueueName, QueueItem } from './runtime.types';
import { queueManager } from './queue-manager';
import { eventBus } from './event-bus';
import { getOrchestratorEngine } from '../orchestrator/orchestrator.service';

export interface QueueProcessorConfig {
  processIntervalMs: number;
  maxConcurrent: number;
  enabled: boolean;
}

const DEFAULT_CONFIG: QueueProcessorConfig = {
  processIntervalMs: 5000,
  maxConcurrent: 3,
  enabled: true,
};

export class QueueProcessor {
  private config: QueueProcessorConfig;
  private intervalId: NodeJS.Timeout | null = null;
  private processingCount = 0;
  private totalProcessed = 0;
  private totalFailed = 0;
  private lastProcessedAt?: string;

  constructor(config: Partial<QueueProcessorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  start(): void {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.processQueues(), this.config.processIntervalMs);
    eventBus.emit('RuntimeStarted', 'queue-processor', { interval: this.config.processIntervalMs });
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    eventBus.emit('RuntimeStopped', 'queue-processor', {});
  }

  private async processQueues(): Promise<void> {
    if (!this.config.enabled) return;
    if (this.processingCount >= this.config.maxConcurrent) return;

    const queuesToProcess: QueueName[] = ['workflows', 'agents', 'sync'];

    for (const queueName of queuesToProcess) {
      if (this.processingCount >= this.config.maxConcurrent) break;

      const item = queueManager.dequeue(queueName);
      if (!item) continue;

      this.processingCount++;
      try {
        await this.processItem(queueName, item);
        queueManager.complete(queueName, item.id);
        this.totalProcessed++;
      } catch (err: any) {
        queueManager.complete(queueName, item.id, err.message);
        this.totalFailed++;
        eventBus.emit('ErrorRaised', 'queue-processor', { queue: queueName, itemId: item.id, error: err.message });
      } finally {
        this.processingCount--;
        this.lastProcessedAt = new Date().toISOString();
      }
    }
  }

  private async processItem(queueName: QueueName, item: QueueItem): Promise<void> {
    eventBus.emit('WorkflowStarted', 'queue-processor', { queue: queueName, itemId: item.id, type: item.type });

    if (queueName === 'workflows' && item.type === 'workflow') {
      const engine = getOrchestratorEngine();
      const params = item.payload as Record<string, any>;
      const workflowId = params.workflowId || params.workflow_id || 'content-creation';
      await engine.startExecution(workflowId, params);
    } else if (queueName === 'agents' && item.type === 'agent') {
      const { executeWorker } = await import('../worker-mode/worker-executor');
      const params = item.payload as any;
      await executeWorker({
        agent_id: params.agent_id || params.target || 'research-agent',
        agent_name: params.agent_name || params.name || 'Agent',
        workspace_id: params.workspace_id || params.blog_id || 'default',
        workflow_id: params.workflow_id,
        provider: params.provider,
        agent_type: params.agent_type,
        context: params.context,
      });
    } else if (queueName === 'sync' && item.type === 'sync') {
      await this.sleep(Math.random() * 1000 + 500);
    }

    eventBus.emit('WorkflowFinished', 'queue-processor', { queue: queueName, itemId: item.id, type: item.type });
  }

  enqueueWorkflow(workflowId: string, params: Record<string, any>, priority = 5): QueueItem | null {
    const item = queueManager.enqueue('workflows', 'workflow', { workflowId, ...params }, priority);
    if (item) eventBus.emit('QueueCreated', 'queue-processor', { queue: 'workflows', itemId: item.id, workflowId });
    return item;
  }

  enqueueAgent(agentId: string, params: Record<string, any>, priority = 5): QueueItem | null {
    const item = queueManager.enqueue('agents', 'agent', { agent_id: agentId, ...params }, priority);
    if (item) eventBus.emit('QueueCreated', 'queue-processor', { queue: 'agents', itemId: item.id, agentId });
    return item;
  }

  getStatus() {
    return {
      enabled: this.config.enabled,
      processing: this.processingCount,
      maxConcurrent: this.config.maxConcurrent,
      totalProcessed: this.totalProcessed,
      totalFailed: this.totalFailed,
      lastProcessedAt: this.lastProcessedAt,
      queues: {
        workflows: queueManager.getPendingCount('workflows'),
        agents: queueManager.getPendingCount('agents'),
        sync: queueManager.getPendingCount('sync'),
      },
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

let processorInstance: QueueProcessor | null = null;

export function getQueueProcessor(): QueueProcessor {
  if (!processorInstance) {
    processorInstance = new QueueProcessor();
  }
  return processorInstance;
}
