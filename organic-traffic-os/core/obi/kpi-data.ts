import { WorkspaceMetrics, GlobalKPIs } from './business-intelligence.types';

export const workspaceMetricsData: Record<string, WorkspaceMetrics> = {
  passacumaru: { workspaceId: 'passacumaru', published: 45, updated: 12, missionsCompleted: 38, avgProductionTime: 42, costPerContent: 0.14, totalCost: 6.3, estimatedROI: 2.8, organicGrowth: 35, leads: 180, conversions: 25, revenue: 1250, domainAuthority: 32, aiVisibility: 68, editorialQuality: 82 },
  qualoseguro: { workspaceId: 'qualoseguro', published: 62, updated: 18, missionsCompleted: 55, avgProductionTime: 35, costPerContent: 0.11, totalCost: 6.82, estimatedROI: 4.2, organicGrowth: 42, leads: 420, conversions: 85, revenue: 3400, domainAuthority: 38, aiVisibility: 72, editorialQuality: 85 },
  utilprobrasil: { workspaceId: 'utilprobrasil', published: 38, updated: 8, missionsCompleted: 32, avgProductionTime: 48, costPerContent: 0.18, totalCost: 6.84, estimatedROI: 5.1, organicGrowth: 28, leads: 95, conversions: 42, revenue: 2100, domainAuthority: 35, aiVisibility: 75, editorialQuality: 88 },
  tabuometro: { workspaceId: 'tabuometro', published: 72, updated: 22, missionsCompleted: 65, avgProductionTime: 28, costPerContent: 0.08, totalCost: 5.76, estimatedROI: 1.9, organicGrowth: 55, leads: 30, conversions: 8, revenue: 420, domainAuthority: 28, aiVisibility: 65, editorialQuality: 78 },
  aiagencyos: { workspaceId: 'aiagencyos', published: 28, updated: 5, missionsCompleted: 24, avgProductionTime: 52, costPerContent: 0.22, totalCost: 6.16, estimatedROI: 8.5, organicGrowth: 38, leads: 85, conversions: 18, revenue: 5200, domainAuthority: 42, aiVisibility: 80, editorialQuality: 90 },
};

export function calculateGlobalKPIs(): GlobalKPIs {
  const metrics = Object.values(workspaceMetricsData);
  const count = metrics.length;
  return {
    totalPublished: metrics.reduce((s, m) => s + m.published, 0),
    totalUpdated: metrics.reduce((s, m) => s + m.updated, 0),
    totalMissions: metrics.reduce((s, m) => s + m.missionsCompleted, 0),
    avgProductionTime: Math.round(metrics.reduce((s, m) => s + m.avgProductionTime, 0) / count),
    avgCostPerContent: parseFloat((metrics.reduce((s, m) => s + m.costPerContent, 0) / count).toFixed(2)),
    totalCost: parseFloat(metrics.reduce((s, m) => s + m.totalCost, 0).toFixed(2)),
    totalROI: parseFloat((metrics.reduce((s, m) => s + m.estimatedROI, 0) / count).toFixed(1)),
    organicGrowth: Math.round(metrics.reduce((s, m) => s + m.organicGrowth, 0) / count),
    totalLeads: metrics.reduce((s, m) => s + m.leads, 0),
    totalConversions: metrics.reduce((s, m) => s + m.conversions, 0),
    totalRevenue: metrics.reduce((s, m) => s + m.revenue, 0),
    avgDomainAuthority: Math.round(metrics.reduce((s, m) => s + m.domainAuthority, 0) / count),
    avgAIVisibility: Math.round(metrics.reduce((s, m) => s + m.aiVisibility, 0) / count),
    avgEditorialQuality: Math.round(metrics.reduce((s, m) => s + m.editorialQuality, 0) / count),
  };
}
