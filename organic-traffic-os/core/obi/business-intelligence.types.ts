export type AlertSeverity = 'info' | 'warning' | 'critical' | 'success';
export type InsightType = 'positive' | 'negative' | 'opportunity' | 'warning' | 'recommendation';

export interface KPI {
  id: string;
  name: string;
  value: number;
  target?: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  workspaceId?: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  workspaceId?: string;
  source: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: InsightType;
  impact: string;
  recommendation: string;
  workspaceId?: string;
  metric?: string;
  timestamp: string;
}

export interface WorkspaceMetrics {
  workspaceId: string;
  published: number;
  updated: number;
  missionsCompleted: number;
  avgProductionTime: number;
  costPerContent: number;
  totalCost: number;
  estimatedROI: number;
  organicGrowth: number;
  leads: number;
  conversions: number;
  revenue: number;
  domainAuthority: number;
  aiVisibility: number;
  editorialQuality: number;
}

export interface GlobalKPIs {
  totalPublished: number;
  totalUpdated: number;
  totalMissions: number;
  avgProductionTime: number;
  avgCostPerContent: number;
  totalCost: number;
  totalROI: number;
  organicGrowth: number;
  totalLeads: number;
  totalConversions: number;
  totalRevenue: number;
  avgDomainAuthority: number;
  avgAIVisibility: number;
  avgEditorialQuality: number;
}

export interface ExecutiveSummary {
  globalKPIs: GlobalKPIs;
  workspaceMetrics: WorkspaceMetrics[];
  alerts: Alert[];
  insights: Insight[];
  topWorkspaces: string[];
  criticalWorkspaces: string[];
}
