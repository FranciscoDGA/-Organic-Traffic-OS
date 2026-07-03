export type ComponentStatus = 'healthy' | 'degraded' | 'unhealthy' | 'offline';
export type AlertSeverity = 'info' | 'warning' | 'high' | 'critical' | 'emergency';
export type IncidentPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ComponentHealth {
  id: string;
  name: string;
  category: string;
  status: ComponentStatus;
  availability: number;
  uptime: number;
  latencyMs: number;
  utilization: number;
  lastExecution?: string;
  lastFailure?: string;
  version: string;
  environment: string;
}

export interface Alert {
  id: string;
  source: string;
  category: string;
  severity: AlertSeverity;
  message: string;
  details: string;
  workspace?: string;
  agent?: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  source: string;
  impact: string;
  workspace?: string;
  agent?: string;
  priority: IncidentPriority;
  assignee?: string;
  probableCause?: string;
  resolution?: string;
  recoveryTimeMs?: number;
  timeline: { timestamp: string; action: string; actor: string }[];
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  createdAt: string;
  resolvedAt?: string;
}

export interface OperationsStatus {
  overallStatus: ComponentStatus;
  totalComponents: number;
  healthy: number;
  degraded: number;
  unhealthy: number;
  offline: number;
  activeAlerts: number;
  openIncidents: number;
  uptime: number;
}
