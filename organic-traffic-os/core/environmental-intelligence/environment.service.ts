import { EnvironmentalEvent, EnvironmentalReport } from './environment.types';
import { monitorEnvironment } from './environment-monitor';
import { detectChanges } from './change-detector';
import { analyzeImpact } from './impact-analyzer';
import { correlateTrends } from './trend-correlator';

export function getEnvironmentService() {
  return {
    monitor() { return monitorEnvironment(); },
    getAlerts() {
      return monitorEnvironment().filter(e => e.riskLevel > 50 || e.impactScore > 70);
    },
    getTrends() {
      return correlateTrends(monitorEnvironment());
    },
    getRecommendations() {
      const events = monitorEnvironment();
      const recs: string[] = [];
      events.forEach(e => {
        if (e.suggestedMission) recs.push(`${e.title}: ${e.suggestedMission}`);
        if (e.riskLevel > 60) recs.push(`Atencao: ${e.title} - risco elevado`);
      });
      return recs;
    },
    analyze() {
      const events = monitorEnvironment();
      const changes = detectChanges(events);
      const trends = correlateTrends(events);
      const recs = this.getRecommendations();
      const overallImpact = Math.round(events.reduce((s, e) => s + e.impactScore, 0) / events.length);

      const report: EnvironmentalReport = {
        id: `env-report-${Date.now()}`,
        totalEvents: events.length,
        criticalAlerts: events.filter(e => e.riskLevel > 60).length,
        opportunities: events.filter(e => e.opportunityLevel > 60).length,
        risks: events.filter(e => e.riskLevel > 50).length,
        events,
        trends,
        recommendations: recs,
        overallImpactScore: overallImpact,
        createdAt: new Date().toISOString(),
      };
      return report;
    },
  };
}
