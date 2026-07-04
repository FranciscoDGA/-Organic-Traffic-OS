export type EventType = 'trending-topic' | 'interest-decline' | 'behavior-change' | 'algorithm-update' | 'competitive-shift' | 'increased-competition' | 'new-topic' | 'seasonality' | 'unexpected-opportunity' | 'strategic-risk';
export type AlertLevel = 'critical' | 'warning' | 'info';
export type EventStatus = 'detected' | 'analyzed' | 'recommended' | 'acted';

export interface EnvironmentalEvent {
  id: string;
  workspaceId?: string;
  type: EventType;
  title: string;
  description: string;
  source: string;
  impactScore: number;
  riskLevel: number;
  opportunityLevel: number;
  urgencyScore: number;
  strategicImpact: number;
  confidence: number;
  relatedWorkspaces: string[];
  suggestedMission?: string;
  status: EventStatus;
  createdAt: string;
}

export interface TrendData {
  topic: string;
  strength: number;
  direction: 'up' | 'down' | 'stable';
  volume: number;
  source: string;
}

export interface EnvironmentalReport {
  id: string;
  totalEvents: number;
  criticalAlerts: number;
  opportunities: number;
  risks: number;
  events: EnvironmentalEvent[];
  trends: TrendData[];
  recommendations: string[];
  overallImpactScore: number;
  createdAt: string;
}
