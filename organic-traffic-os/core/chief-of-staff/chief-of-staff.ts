import { PriorityTask, DailyPlan, ExecutiveSummary } from './chief.types';
import { sortTasksByPriority } from './priority-engine';
import { estimateCapacity, detectBottlenecks } from './capacity-planner';
import { distributeTasks } from './task-distributor';
import { balanceWorkload } from './workload-balancer';

function generateDefaultTasks(): PriorityTask[] {
  const now = new Date().toISOString();
  return [
    { id: 'tsk-c01', missionId: 'msn-001', workspaceId: 'passacumaru', title: 'Escrever artigo cluster viagens', description: 'Artigo pillar do cluster', priority: 'high', status: 'scheduled', urgency: 80, impact: 75, risk: 30, dependencies: [], estimatedTime: 4, estimatedCost: 2.5, assignedTo: 'Writer Agent', createdAt: now },
    { id: 'tsk-c02', missionId: 'msn-001', workspaceId: 'passacumaru', title: 'Revisar artigos pendentes', description: 'Revisar 3 artigos em fila', priority: 'medium', status: 'scheduled', urgency: 60, impact: 50, risk: 20, dependencies: ['tsk-c01'], estimatedTime: 2, estimatedCost: 1.0, assignedTo: 'Review Agent', createdAt: now },
    { id: 'tsk-c03', missionId: 'msn-003', workspaceId: 'garimpeibrasil', title: 'Publicar artigos blog', description: 'Publicar 2 artigos no WordPress', priority: 'critical', status: 'scheduled', urgency: 90, impact: 85, risk: 15, dependencies: [], estimatedTime: 1, estimatedCost: 0.5, assignedTo: 'Publishing Agent', createdAt: now },
    { id: 'tsk-c04', missionId: 'msn-003', workspaceId: 'garimpeibrasil', title: 'Pesquisar proximo cluster', description: 'Identificar proximas oportunidades', priority: 'medium', status: 'pending', urgency: 50, impact: 60, risk: 25, dependencies: [], estimatedTime: 3, estimatedCost: 1.5, assignedTo: 'Research Agent', createdAt: now },
    { id: 'tsk-c05', missionId: 'msn-001', workspaceId: 'passacumaru', title: 'Monitorar performance', description: 'Verificar metricas de trafego', priority: 'low', status: 'pending', urgency: 40, impact: 35, risk: 10, dependencies: [], estimatedTime: 1, estimatedCost: 0.3, assignedTo: 'Monitoring Agent', createdAt: now },
  ];
}

function generateSummary(tasks: PriorityTask[], bottlenecks: string[]): ExecutiveSummary {
  const critical = tasks.filter(t => t.priority === 'critical');
  const high = tasks.filter(t => t.priority === 'high');
  return {
    topPriorities: critical.map(t => t.title).concat(high.slice(0, 2).map(t => t.title)),
    criticalTasks: critical.map(t => t.title),
    biggestRisk: bottlenecks.length > 0 ? bottlenecks[0] : 'Nenhum gargalo detectado',
    biggestOpportunity: 'Expandir cluster de viagens com artigos de apoio',
    mostImportantMission: 'msn-001 - Expansao Cluster Viagens',
    operationalRecommendation: 'Priorizar escrita e publicacao de artigos criticos hoje',
  };
}

export function getChiefOfStaffService() {
  return {
    createDailyPlan(workspaceId: string = 'all'): DailyPlan {
      const tasks = generateDefaultTasks();
      const sorted = sortTasksByPriority(tasks);
      const capacity = estimateCapacity();
      const bottlenecks = detectBottlenecks(capacity);
      const distributed = distributeTasks(sorted);

      return {
        id: `plan-${Date.now()}`,
        workspaceId,
        date: new Date().toISOString().split('T')[0],
        objectives: ['Expandir cluster de viagens', 'Publicar artigos pendentes', 'Monitorar performance'],
        priorityTasks: sorted,
        scheduledWorkflows: distributed.map(d => ({ id: d.task.id, name: d.task.title, time: d.scheduledTime })),
        estimatedTime: sorted.reduce((s, t) => s + t.estimatedTime, 0),
        estimatedCost: parseFloat(sorted.reduce((s, t) => s + t.estimatedCost, 0).toFixed(2)),
        risks: bottlenecks,
        opportunities: ['Aproveitar janela de publicacao', 'Expandir cluster com keywords de cauda longa'],
        recommendations: ['Iniciar pelas tarefas criticas', 'Manter monitoramento constante'],
        createdAt: new Date().toISOString(),
      };
    },

    getPlans(): DailyPlan[] {
      return [this.createDailyPlan()];
    },

    getPriorities(): PriorityTask[] {
      return sortTasksByPriority(generateDefaultTasks());
    },

    getCapacity() {
      return estimateCapacity();
    },

    getSummary(): ExecutiveSummary {
      const tasks = generateDefaultTasks();
      const capacity = estimateCapacity();
      return generateSummary(tasks, detectBottlenecks(capacity));
    },

    getWorkload() {
      return balanceWorkload(generateDefaultTasks());
    },
  };
}
