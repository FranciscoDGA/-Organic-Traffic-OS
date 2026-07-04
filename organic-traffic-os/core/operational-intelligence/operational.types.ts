export type BottleneckType = 'queue-congestion' | 'slow-workflow' | 'overloaded-agent' | 'excessive-ai-consumption' | 'token-waste' | 'task-repetition' | 'redundant-calls' | 'low-resource-utilization';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type RecommendationPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface OperationalMetrics {
  runtime_efficiency: number;
  workflow_efficiency: number;
  agent_utilization: number;
  token_efficiency: number;
  cost_efficiency: number;
  queue_efficiency: number;
  scheduler_efficiency: number;
  execution_throughput: number;
  system_health_score: number;
  operational_score: number;
}

export interface Bottleneck {
  id: string;
  type: BottleneckType;
  severity: Severity;
  description: string;
  component: string;
  impact: number;
  detected_at: string;
}

export interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  benefit: string;
  risk: string;
  estimated_savings: number;
  operational_impact: string;
  confidence: number;
  priority: RecommendationPriority;
  component: string;
  created_at: string;
}

export interface OperationalReport {
  id: string;
  metrics: OperationalMetrics;
  bottlenecks: Bottleneck[];
  recommendations: OptimizationRecommendation[];
  cost_analysis: CostAnalysis;
  created_at: string;
}

export interface CostAnalysis {
  total_cost: number;
  ai_cost: number;
  token_cost: number;
  infrastructure_cost: number;
  potential_savings: number;
  cost_trend: 'up' | 'down' | 'stable';
}
