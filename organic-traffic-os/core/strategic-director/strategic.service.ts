import { StrategicReport, MissionSupervision, StrategicDecision } from './strategic.types';
import { runDirectorCycle, getAllDecisions, getDecisionsByMission } from './mission-supervisor';
import { prioritizeMissions } from './priority-manager';

const preloadedMissions = [
  { id: 'msn-001', workspaceId: 'passacumaru', name: 'Expansao Cluster Viagens', status: 'active', progress: 35, tasks: [{ status: 'completed' }, { status: 'running' }, { status: 'pending' }, { status: 'pending' }] },
  { id: 'msn-002', workspaceId: 'passacumaru', name: 'Auditoria SEO Completa', status: 'planned', progress: 0, tasks: [{ status: 'pending' }] },
  { id: 'msn-003', workspaceId: 'garimpeibrasil', name: 'Lancamento Blog Garimpeo', status: 'active', progress: 60, tasks: [{ status: 'completed' }, { status: 'running' }, { status: 'completed' }] },
];

export function getStrategicService() {
  return {
    analyze(missions?: any[]) {
      const data = missions || preloadedMissions;
      return runDirectorCycle(data);
    },
    getSupervisions(missions?: any[]) {
      const data = missions || preloadedMissions;
      const result = runDirectorCycle(data);
      return prioritizeMissions(result.supervisions);
    },
    getDecisions() { return getAllDecisions(); },
    getDecisionsByMission(missionId: string) { return getDecisionsByMission(missionId); },
    getRecommendations(missions?: any[]) {
      const data = missions || preloadedMissions;
      const result = runDirectorCycle(data);
      return result.supervisions.flatMap(s => s.recommendations.map(r => ({ missionId: s.missionId, recommendation: r, score: s.score.overallStrategicScore })));
    },
    generateReport(missions?: any[]): StrategicReport {
      const data = missions || preloadedMissions;
      const result = runDirectorCycle(data);
      return {
        id: `strategic-${Date.now()}`,
        supervisedMissions: result.supervisions.length,
        activeDecisions: result.newDecisions.length,
        missionSupervisions: result.supervisions,
        recentDecisions: result.newDecisions,
        overallStrategicScore: Math.round(result.supervisions.reduce((s, sup) => s + sup.score.overallStrategicScore, 0) / (result.supervisions.length || 1)),
        recommendations: result.supervisions.flatMap(s => s.recommendations),
        createdAt: new Date().toISOString(),
      };
    },
  };
}
