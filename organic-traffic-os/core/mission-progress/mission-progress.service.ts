import { MissionProgressData, MissionKPI, Milestone } from './mission-progress.types';
import { analyzeMissionProgress } from './mission-progress.engine';

const kpis: MissionKPI[] = [
  { id: 'kpi-001', workspaceId: 'passacumaru', missionId: 'msn-001', name: 'Artigos Publicados', description: 'Numero de artigos publicados no cluster', currentValue: 4, targetValue: 10, unit: 'artigos', progress: 40, trend: 'up', confidence: 0.9, lastUpdated: '2026-07-03' },
  { id: 'kpi-002', workspaceId: 'passacumaru', missionId: 'msn-001', name: 'Trafego Organico', description: 'Aumento de trafego organico', currentValue: 15, targetValue: 30, unit: '%', progress: 50, trend: 'up', confidence: 0.8, lastUpdated: '2026-07-03' },
  { id: 'kpi-003', workspaceId: 'passacumaru', missionId: 'msn-002', name: 'Score SEO', description: 'Score medio de SEO dos artigos', currentValue: 72, targetValue: 90, unit: 'pts', progress: 80, trend: 'stable', confidence: 0.85, lastUpdated: '2026-07-03' },
  { id: 'kpi-004', workspaceId: 'garimpeibrasil', missionId: 'msn-003', name: 'Artigos Lancados', description: 'Artigos publicados no blog', currentValue: 3, targetValue: 5, unit: 'artigos', progress: 60, trend: 'up', confidence: 0.9, lastUpdated: '2026-07-03' },
  { id: 'kpi-005', workspaceId: 'garimpeibrasil', missionId: 'msn-003', name: 'Indexacao Google', description: 'Paginas indexadas no Google', currentValue: 2, targetValue: 5, unit: 'paginas', progress: 40, trend: 'up', confidence: 0.7, lastUpdated: '2026-07-03' },
];

const milestones: Milestone[] = [
  { id: 'ms-001', missionId: 'msn-001', name: 'Pesquisa de Keywords', description: 'Pack de keywords pronto', deadline: '2026-07-05', status: 'completed', progress: 100, dependencies: [], assignee: 'Research Agent' },
  { id: 'ms-002', missionId: 'msn-001', name: 'Escrita dos Artigos', description: '10 artigos escritos', deadline: '2026-07-20', status: 'in-progress', progress: 40, dependencies: ['ms-001'], assignee: 'Writer Agent' },
  { id: 'ms-003', missionId: 'msn-001', name: 'Publicacao', description: 'Artigos publicados no WordPress', deadline: '2026-07-30', status: 'pending', progress: 0, dependencies: ['ms-002'], assignee: 'Publishing Agent' },
  { id: 'ms-004', missionId: 'msn-003', name: 'Conteudo Base', description: '5 artigos iniciais escritos', deadline: '2026-07-10', status: 'in-progress', progress: 60, dependencies: [], assignee: 'Writer Agent' },
  { id: 'ms-005', missionId: 'msn-003', name: 'Publicacao Inicial', description: 'Artigos publicados', deadline: '2026-07-15', status: 'pending', progress: 0, dependencies: ['ms-004'], assignee: 'Publishing Agent' },
];

export function getMissionProgressService() {
  return {
    getAll(): MissionProgressData[] {
      const missions = [
        { id: 'msn-001', workspaceId: 'passacumaru', name: 'Expansao Cluster Viagens', progress: 35, status: 'active' },
        { id: 'msn-002', workspaceId: 'passacumaru', name: 'Auditoria SEO Completa', progress: 0, status: 'planned' },
        { id: 'msn-003', workspaceId: 'garimpeibrasil', name: 'Lancamento Blog Garimpeo', progress: 60, status: 'active' },
      ];
      return missions.map(m => analyzeMissionProgress(m, kpis.filter(k => k.missionId === m.id), milestones.filter(ms => ms.missionId === m.id)));
    },
    getByMission(missionId: string): MissionProgressData | null {
      const missions = [
        { id: 'msn-001', workspaceId: 'passacumaru', name: 'Expansao Cluster Viagens', progress: 35, status: 'active' },
        { id: 'msn-002', workspaceId: 'passacumaru', name: 'Auditoria SEO Completa', progress: 0, status: 'planned' },
        { id: 'msn-003', workspaceId: 'garimpeibrasil', name: 'Lancamento Blog Garimpeo', progress: 60, status: 'active' },
      ];
      const m = missions.find(x => x.id === missionId);
      if (!m) return null;
      return analyzeMissionProgress(m, kpis.filter(k => k.missionId === m.id), milestones.filter(ms => ms.missionId === m.id));
    },
    getKPIs() { return kpis; },
    getMilestones() { return milestones; },
    getAllAlerts(): { missionId: string; alerts: import('./mission-progress.types').ProgressAlert[] }[] {
      return this.getAll().map(m => ({ missionId: m.missionId, alerts: m.alerts }));
    },
  };
}
