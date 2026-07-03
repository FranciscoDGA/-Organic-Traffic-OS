import { ReliabilityIndicators, ReliabilityScore, TrendData, CapacityMetrics, Recommendation, ReliabilityReport, ReportPeriod } from './reliability.types';
import { calculateReliabilityScore } from './reliability-score';
import { generateTrends } from './trend-analyzer';
import { generateCapacityMetrics } from './capacity-monitor';
import { generateRecommendations } from './recommendation-engine';

let reportCounter = 0;

function generateIndicators(): ReliabilityIndicators {
  const uptime = 99 + Math.random() * 0.9;
  const availability = 98 + Math.random() * 1.9;
  const mtbf = 200 + Math.random() * 600;
  const mttr = 5 + Math.random() * 25;
  const errorRate = Math.random() * 2;
  const avgLatencyMs = 50 + Math.random() * 150;
  const throughput = 100 + Math.random() * 400;
  const resourceUtilization = 30 + Math.random() * 40;
  const costGrowth = Math.random() * 10;
  return {
    uptime: parseFloat(uptime.toFixed(2)), availability: parseFloat(availability.toFixed(2)),
    mtbf: parseFloat(mtbf.toFixed(0)), mttr: parseFloat(mttr.toFixed(1)),
    errorRate: parseFloat(errorRate.toFixed(2)), avgLatencyMs: parseFloat(avgLatencyMs.toFixed(0)),
    throughput: parseFloat(throughput.toFixed(0)), resourceUtilization: parseFloat(resourceUtilization.toFixed(1)),
    costGrowth: parseFloat(costGrowth.toFixed(1)),
    overallReliability: 0,
  };
}

function generateBottlenecks(capacity: CapacityMetrics, indicators: ReliabilityIndicators): string[] {
  const alerts: string[] = [];
  if (capacity.cpuUsage > 70) alerts.push('CPU com uso elevado');
  if (capacity.memoryUsage > 70) alerts.push('Memoria com uso elevado');
  if (capacity.queueDepth > 30) alerts.push('Queue congestionada');
  if (capacity.aiConsumption > 40) alerts.push('Consumo de IA elevado');
  if (indicators.errorRate > 1.5) alerts.push('Taxa de erros acima do esperado');
  if (indicators.avgLatencyMs > 150) alerts.push('Latencia media elevada');
  return alerts;
}

export class ReliabilityEngine {
  private reports: Map<string, ReliabilityReport> = new Map();

  calculateScore(): ReliabilityScore {
    const indicators = generateIndicators();
    return calculateReliabilityScore(indicators);
  }

  generateReport(period: ReportPeriod = 'daily'): ReliabilityReport {
    const indicators = generateIndicators();
    const score = calculateReliabilityScore(indicators);
    indicators.overallReliability = score.overall;
    const capacity = generateCapacityMetrics();
    const trends = generateTrends(period);
    const recommendations = generateRecommendations(5);
    const bottleneckAlerts = generateBottlenecks(capacity, indicators);
    const id = `rel-${Date.now()}-${++reportCounter}`;
    const report: ReliabilityReport = { id, period, indicators, capacity, trends, recommendations, bottleneckAlerts, generatedAt: new Date().toISOString() };
    this.reports.set(id, report);
    return report;
  }

  getLatest(): ReliabilityReport | undefined { return Array.from(this.reports.values()).pop(); }
  getAll(): ReliabilityReport[] { return Array.from(this.reports.values()); }
  getReport(id: string): ReliabilityReport | undefined { return this.reports.get(id); }
}

export const reliabilityEngine = new ReliabilityEngine();
