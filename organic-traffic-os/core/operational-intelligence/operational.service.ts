import { OperationalMetrics, CostAnalysis, Bottleneck, OptimizationRecommendation, OperationalReport } from './operational.types';
import { analyzePerformance } from './performance-analyzer';
import { analyzeCosts } from './cost-analyzer';
import { analyzeTokenUsage } from './token-analyzer';
import { detectBottlenecks } from './bottleneck-detector';
import { generateOptimizationPlan } from './optimization-planner';

const reports: OperationalReport[] = [];

export function getOperationalService() {
  return {
    analyze() {
      const metrics = analyzePerformance();
      const costs = analyzeCosts();
      const bottlenecks = detectBottlenecks();
      const recommendations = generateOptimizationPlan();
      const tokenAnalysis = analyzeTokenUsage();
      const report: OperationalReport = { id: `op-report-${Date.now()}`, metrics, bottlenecks, recommendations, cost_analysis: costs, created_at: new Date().toISOString() };
      reports.push(report);
      return { report, token_analysis: tokenAnalysis };
    },
    getReports(limit = 50) { return reports.slice(-limit); },
    getLatestReport() { return reports.length > 0 ? reports[reports.length - 1] : null; },
    getPerformance() { return analyzePerformance(); },
    getCosts() { return analyzeCosts(); },
    getRecommendations() { return generateOptimizationPlan(); },
  };
}
