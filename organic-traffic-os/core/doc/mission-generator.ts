import { DailyMission, MissionType, MissionPriority, WorkspaceDailyCheck } from './daily-operations.types';

let missionCounter = 0;

function createMission(type: MissionType, workspaceId: string, title: string, description: string, priority: MissionPriority, duration: number, cost: number, reason: string): DailyMission {
  return { id: `mission-${Date.now()}-${++missionCounter}`, type, workspaceId, title, description, priority, estimatedDuration: duration, estimatedCost: cost, reason, createdAt: new Date().toISOString() };
}

export function generateMissions(checks: WorkspaceDailyCheck[]): DailyMission[] {
  const missions: DailyMission[] = [];
  for (const check of checks) {
    if (!check.active) continue;
    if (check.outdatedContents > 0) {
      missions.push(createMission('refresh', check.workspaceId, `Atualizar ${check.outdatedContents} conteudos desatualizados`, `Refresh de conteudos que nao sao atualizados ha mais de 90 dias`, 'high', 30, 0.06, 'Conteudos desatualizados detectados'));
    }
    if (check.pendingContents > 0) {
      missions.push(createMission('new_article', check.workspaceId, `Produzir ${check.pendingContents} novos artigos`, 'Artigos planejados no calendario editorial', 'normal', 45, 0.12, 'Calendario editorial'));
    }
    if (check.activeCampaigns > 0) {
      missions.push(createMission('campaign', check.workspaceId, `Gerenciar ${check.activeCampaigns} campanhas ativas`, 'Monitorar e otimizar campanhas em andamento', 'normal', 20, 0.05, 'Campanhas ativas'));
    }
  }
  return missions;
}

export function prioritizeMissions(missions: DailyMission[]): DailyMission[] {
  const order: Record<MissionPriority, number> = { urgent: 0, high: 1, normal: 2, low: 3, background: 4 };
  return [...missions].sort((a, b) => order[a.priority] - order[b.priority]);
}
