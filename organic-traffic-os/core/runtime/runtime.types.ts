export type RuntimeState = 'stopped' | 'starting' | 'running' | 'stopping' | 'error';

export type ModuleType = 'connector' | 'engine' | 'agent' | 'workflow' | 'adapter' | 'provider';

export type ModuleStatus = 'registered' | 'loaded' | 'active' | 'error' | 'unloaded';

export interface ModuleDefinition {
  id: string;
  name: string;
  type: ModuleType;
  version: string;
  dependencies: string[];
  status: ModuleStatus;
  loadedAt?: string;
  error?: string;
}

export type QueueName = 'workflows' | 'agents' | 'publishing' | 'sync' | 'updates' | 'monitoring';

export interface QueueItem {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  priority: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  retries: number;
}

export interface Queue {
  name: QueueName;
  items: QueueItem[];
  maxSize: number;
  processing: boolean;
}

export type EventType =
  | 'WorkflowStarted'
  | 'WorkflowFinished'
  | 'AgentStarted'
  | 'AgentFinished'
  | 'EngineStarted'
  | 'EngineFinished'
  | 'ConnectorSync'
  | 'QueueCreated'
  | 'QueueFinished'
  | 'ErrorRaised'
  | 'HealthChanged'
  | 'RuntimeStarted'
  | 'RuntimeStopped'
  | 'Heartbeat'
  | 'ModuleLoaded'
  | 'ModuleUnloaded';

export interface RuntimeEvent {
  id: string;
  type: EventType;
  source: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export type ScheduleType = 'cron' | 'interval' | 'once' | 'manual';

export interface Schedule {
  id: string;
  workflowId: string;
  type: ScheduleType;
  expression: string;
  intervalMs?: number;
  lastRun?: string;
  nextRun?: string;
  enabled: boolean;
  manualTrigger: boolean;
}

export interface HeartbeatData {
  timestamp: string;
  uptimeMs: number;
  memoryUsageMB: number;
  cpuUsagePercent?: number;
  activeModules: number;
  activeTasks: number;
  queueSizes: Record<QueueName, number>;
}

export type HealthCategory = 'runtime' | 'queues' | 'workflows' | 'agents' | 'connectors' | 'engines' | 'overall';

export interface HealthScore {
  category: HealthCategory;
  score: number;
  status: 'healthy' | 'degraded' | 'critical';
  details: Record<string, unknown>;
  lastChecked: string;
}

export interface RuntimeStatus {
  state: RuntimeState;
  uptimeMs: number;
  startedAt?: string;
  lastHeartbeat?: string;
  modules: ModuleDefinition[];
  queues: Record<QueueName, Queue>;
  schedules: Schedule[];
  recentEvents: RuntimeEvent[];
  health: HealthScore[];
  memoryUsageMB: number;
}

export interface RuntimeConfig {
  maxQueueSize: number;
  heartbeatIntervalMs: number;
  healthCheckIntervalMs: number;
  maxRetries: number;
  enableScheduler: boolean;
  enableHealthMonitor: boolean;
  enableHeartbeat: boolean;
}
