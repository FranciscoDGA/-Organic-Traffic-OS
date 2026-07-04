import { Mission, MissionTask, MissionType, MissionStatus, TaskPriority } from './mission.types';
import { getWorkflowForMission } from './mission-orchestrator';

const missions: Mission[] = [
  {
    id: 'msn-001', workspaceId: 'passacumaru', name: 'Expansao Cluster Viagens', description: 'Expandir cluster de viagens com 10 novos artigos', objective: 'Aumentar trafego organico em 30%',
    type: 'cluster-expansion', priority: 'high', status: 'active', owner: 'CEO', strategy: 'Criar cluster completo com artigos pillar + supporting',
    expectedResult: '+30% trafego organico', deadline: '2026-08-15', progress: 35,
    tasks: [
      { id: 'tsk-001', missionId: 'msn-001', workflowId: 'full-seo-cycle', type: 'research', priority: 'high', dependencies: [], status: 'completed', assignee: 'Research Agent', progress: 100, result: 'Pack de 15 keywords identificado', createdAt: '2026-07-01', updatedAt: '2026-07-02' },
      { id: 'tsk-002', missionId: 'msn-001', workflowId: 'full-seo-cycle', type: 'writing', priority: 'high', dependencies: ['tsk-001'], status: 'running', assignee: 'Writer Agent', progress: 40, createdAt: '2026-07-02', updatedAt: '2026-07-03' },
      { id: 'tsk-003', missionId: 'msn-001', workflowId: 'full-seo-cycle', type: 'review', priority: 'medium', dependencies: ['tsk-002'], status: 'pending', assignee: 'Review Agent', progress: 0, createdAt: '2026-07-03', updatedAt: '2026-07-03' },
      { id: 'tsk-004', missionId: 'msn-001', workflowId: 'full-seo-cycle', type: 'publishing', priority: 'medium', dependencies: ['tsk-003'], status: 'pending', assignee: 'Publishing Agent', progress: 0, createdAt: '2026-07-03', updatedAt: '2026-07-03' },
    ],
    estimatedDuration: 45, estimatedCost: 25.0,
    history: [
      { action: 'created', timestamp: '2026-07-01T10:00:00Z', details: 'Missao criada pelo CEO' },
      { action: 'started', timestamp: '2026-07-01T10:05:00Z', details: 'Missao iniciada' },
      { action: 'task_completed', timestamp: '2026-07-02T14:00:00Z', details: 'Pesquisa concluida' },
    ],
    createdAt: '2026-07-01T10:00:00Z', updatedAt: '2026-07-03T08:00:00Z',
  },
  {
    id: 'msn-002', workspaceId: 'passacumaru', name: 'Auditoria SEO Completa', description: 'Auditoria completa de SEO on-page e technical', objective: 'Identificar e corrigir todos os problemas de SEO',
    type: 'full-audit', priority: 'medium', status: 'planned', owner: 'CEO', strategy: 'Executar auditoria automatizada + revisao manual',
    expectedResult: 'Score SEO > 90', deadline: '2026-07-30', progress: 0,
    tasks: [
      { id: 'tsk-005', missionId: 'msn-002', workflowId: 'data-collection', type: 'audit', priority: 'medium', dependencies: [], status: 'pending', assignee: 'Monitoring Agent', progress: 0, createdAt: '2026-07-03', updatedAt: '2026-07-03' },
    ],
    estimatedDuration: 20, estimatedCost: 10.0,
    history: [{ action: 'created', timestamp: '2026-07-03T09:00:00Z', details: 'Missao criada' }],
    createdAt: '2026-07-03T09:00:00Z', updatedAt: '2026-07-03T09:00:00Z',
  },
  {
    id: 'msn-003', workspaceId: 'garimpeibrasil', name: 'Lancamento Blog Garimpeo', description: 'Lancar blog com 5 artigos iniciais', objective: 'Estabelecer presenca online',
    type: 'blog-launch', priority: 'critical', status: 'active', owner: 'CEO', strategy: 'Criar conteudo base + configurar publicacao',
    expectedResult: '5 artigos publicados', deadline: '2026-07-20', progress: 60,
    tasks: [
      { id: 'tsk-006', missionId: 'msn-003', workflowId: 'content-creation', type: 'writing', priority: 'critical', dependencies: [], status: 'completed', assignee: 'Writer Agent', progress: 100, result: '3 artigos escritos', createdAt: '2026-07-01', updatedAt: '2026-07-02' },
      { id: 'tsk-007', missionId: 'msn-003', workflowId: 'content-creation', type: 'writing', priority: 'critical', dependencies: [], status: 'running', assignee: 'Writer Agent', progress: 50, createdAt: '2026-07-02', updatedAt: '2026-07-03' },
      { id: 'tsk-008', missionId: 'msn-003', workflowId: 'publish-pipeline', type: 'publishing', priority: 'high', dependencies: ['tsk-006'], status: 'completed', assignee: 'Publishing Agent', progress: 100, result: '3 artigos publicados', createdAt: '2026-07-02', updatedAt: '2026-07-03' },
    ],
    estimatedDuration: 15, estimatedCost: 8.0,
    history: [
      { action: 'created', timestamp: '2026-07-01T08:00:00Z', details: 'Missao criada' },
      { action: 'started', timestamp: '2026-07-01T08:10:00Z', details: 'Missao iniciada' },
    ],
    createdAt: '2026-07-01T08:00:00Z', updatedAt: '2026-07-03T07:00:00Z',
  },
];

export function getAllMissions(): Mission[] { return missions; }
export function getMissionsByWorkspace(ws: string): Mission[] { return missions.filter(m => m.workspaceId === ws); }
export function getMissionById(id: string): Mission | undefined { return missions.find(m => m.id === id); }

export function createMission(data: Omit<Mission, 'id' | 'tasks' | 'history' | 'createdAt' | 'updatedAt' | 'progress'>): Mission {
  const workflowId = getWorkflowForMission(data.type);
  const m: Mission = {
    ...data, id: `msn-${Date.now()}`, tasks: [], progress: 0,
    history: [{ action: 'created', timestamp: new Date().toISOString(), details: 'Missao criada' }],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  missions.push(m);
  return m;
}

export function createMissionWithTasks(data: Omit<Mission, 'id' | 'tasks' | 'history' | 'createdAt' | 'updatedAt' | 'progress'>, tasks: Omit<MissionTask, 'id' | 'missionId' | 'workflowId' | 'createdAt' | 'updatedAt'>[]): Mission {
  const workflowId = getWorkflowForMission(data.type);
  const m: Mission = {
    ...data, id: `msn-${Date.now()}`, progress: 0,
    tasks: tasks.map((t, i) => ({
      ...t,
      id: `tsk-${Date.now()}-${i}`,
      missionId: `msn-${Date.now()}`,
      workflowId: workflowId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    history: [{ action: 'created', timestamp: new Date().toISOString(), details: 'Missao criada com tarefas' }],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  missions.push(m);
  return m;
}

export function updateMission(id: string, updates: Partial<Mission>): Mission | undefined {
  const m = missions.find(x => x.id === id);
  if (!m) return undefined;
  Object.assign(m, updates, { updatedAt: new Date().toISOString() });
  return m;
}
