import { GlobalKPIs, WorkspaceMetrics, Alert, Insight, ExecutiveSummary } from './business-intelligence.types';
import { workspaceMetricsData, calculateGlobalKPIs } from './kpi-data';
import { generateAlerts } from './alerts';
import { generateInsights } from './insights';

class OBIService {
  private metrics = workspaceMetricsData;
  private alerts = generateAlerts();
  private insights = generateInsights();

  getGlobalKPIs(): GlobalKPIs { return calculateGlobalKPIs(); }
  getWorkspaceMetrics(): WorkspaceMetrics[] { return Object.values(this.metrics); }
  getWorkspaceMetric(id: string): WorkspaceMetrics | undefined { return this.metrics[id]; }
  getAlerts(): Alert[] { return this.alerts; }
  getInsights(): Insight[] { return this.insights; }

  getTopWorkspaces(): string[] {
    return Object.entries(this.metrics).sort((a, b) => b[1].estimatedROI - a[1].estimatedROI).slice(0, 3).map(([id]) => id);
  }

  getCriticalWorkspaces(): string[] {
    return Object.entries(this.metrics).filter(([, m]) => m.organicGrowth < 30 || m.editorialQuality < 80).map(([id]) => id);
  }

  getExecutiveSummary(): ExecutiveSummary {
    return { globalKPIs: this.getGlobalKPIs(), workspaceMetrics: this.getWorkspaceMetrics(), alerts: this.alerts, insights: this.insights, topWorkspaces: this.getTopWorkspaces(), criticalWorkspaces: this.getCriticalWorkspaces() };
  }

  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return false;
    alert.acknowledged = true;
    return true;
  }
}

export const obiService = new OBIService();
