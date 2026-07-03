export type TrendDirection = 'improving' | 'stable' | 'degrading';
export type ReportPeriod = 'daily' | 'weekly' | 'monthly';

export interface ReliabilityIndicators {
  uptime: number;
  availability: number;
  mtbf: number;
  mttr: number;
  errorRate: number;
  avgLatencyMs: number;
  throughput: number;
  resourceUtilization: number;
  costGrowth: number;
  overallReliability: number;
}

export interface CapacityMetrics {
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  queueDepth: number;
  jobsRunning: number;
  missionsRunning: number;
  publicationsRunning: number;
  aiConsumption: number;
  connectorUtilization: number;
}

export interface TrendData {
  metric: string;
  current: number;
  previous: number;
  change: number;
  direction: TrendDirection;
  period: ReportPeriod;
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  createdAt: string;
}

export interface ReliabilityReport {
  id: string;
  period: ReportPeriod;
  indicators: ReliabilityIndicators;
  capacity: CapacityMetrics;
  trends: TrendData[];
  recommendations: Recommendation[];
  bottleneckAlerts: string[];
  generatedAt: string;
}

export interface ReliabilityScore {
  overall: number;
  availability: number;
  performance: number;
  resilience: number;
  efficiency: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
}
