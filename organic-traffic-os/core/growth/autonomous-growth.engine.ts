import { GrowthAction, GrowthPlan } from './growth.types';
import { createGrowthAction } from './growth-action-builder';
import { prioritizeActions, calculatePriorityScore } from './growth-prioritizer';

const plans: Map<string, GrowthPlan> = new Map();
const allActions: Map<string, GrowthAction[]> = new Map();

function init() {
  const ws1 = 'passacumaru';
  const actions1: GrowthAction[] = [
    createGrowthAction({ workspaceId: ws1, type: 'create_content', title: 'Criar artigo sobre edital INSS 2026', description: 'Novo edital publicado, alta demanda de busca', expectedImpact: 90, effort: 40, confidence: 0.92, risk: 'low', origin: 'opportunity-intelligence', recommendedWorkflow: 'new_article' }),
    createGrowthAction({ workspaceId: ws1, type: 'update_content', title: 'Atualizar guia de concursos municipais', description: 'Conteudo desatualizado ha 90 dias', expectedImpact: 70, effort: 25, confidence: 0.88, risk: 'low', origin: 'auto-learning', recommendedWorkflow: 'refresh' }),
    createGrowthAction({ workspaceId: ws1, type: 'expand_cluster', title: 'Expandir cluster de concursos de saude', description: 'Cluster forte com oportunidade de crescimento', expectedImpact: 85, effort: 60, confidence: 0.9, risk: 'medium', origin: 'content-intelligence', recommendedWorkflow: 'new_article' }),
    createGrowthAction({ workspaceId: ws1, type: 'create_experiment', title: 'Testar titulo com "Guia Completo"', description: 'Experimento de titulo baseado em aprendizado', expectedImpact: 60, effort: 15, confidence: 0.85, risk: 'low', origin: 'auto-learning', recommendedWorkflow: 'campaign' }),
    createGrowthAction({ workspaceId: ws1, type: 'improve_cta', title: 'Melhorar CTA de editais', description: 'CTA atual com baixa conversao', expectedImpact: 55, effort: 10, confidence: 0.82, risk: 'low', origin: 'experimentation', recommendedWorkflow: 'refresh' }),
    createGrowthAction({ workspaceId: ws1, type: 'add_faq', title: 'Adicionar FAQ sobre inscricao INSS', description: 'Pergunta frequente nao respondida', expectedImpact: 50, effort: 15, confidence: 0.87, risk: 'low', origin: 'semantic-intelligence', recommendedWorkflow: 'refresh' }),
    createGrowthAction({ workspaceId: ws1, type: 'create_pillar', title: 'Criar pagina pilar sobre concursos', description: 'Cluster precisa de pagina pilar', expectedImpact: 80, effort: 70, confidence: 0.85, risk: 'medium', origin: 'authority-intelligence', recommendedWorkflow: 'new_article' }),
    createGrowthAction({ workspaceId: ws1, type: 'create_newsletter', title: 'Criar newsletter semanal de editais', description: 'Oportunidade de retencao', expectedImpact: 65, effort: 30, confidence: 0.78, risk: 'low', origin: 'predictive-intelligence', recommendedWorkflow: 'campaign' }),
  ];

  const ws2 = 'garimpeibrasil';
  const actions2: GrowthAction[] = [
    createGrowthAction({ workspaceId: ws2, type: 'create_content', title: 'Artigo sobre CDI 2026', description: 'CDI em alta, demanda crescente', expectedImpact: 85, effort: 35, confidence: 0.9, risk: 'low', origin: 'opportunity-intelligence', recommendedWorkflow: 'new_article' }),
    createGrowthAction({ workspaceId: ws2, type: 'expand_cluster', title: 'Expandir cluster de renda fixa', description: 'Cluster com potencial nao explorado', expectedImpact: 75, effort: 50, confidence: 0.85, risk: 'medium', origin: 'content-intelligence', recommendedWorkflow: 'new_article' }),
    createGrowthAction({ workspaceId: ws2, type: 'improve_title', title: 'Melhorar titulos de investimentos', description: 'Titulos genericos com baixo CTR', expectedImpact: 60, effort: 10, confidence: 0.8, risk: 'low', origin: 'auto-learning', recommendedWorkflow: 'refresh' }),
  ];

  allActions.set(ws1, actions1);
  allActions.set(ws2, actions2);

  actions1.forEach(a => { a.status = 'approved'; });
  actions2[0].status = 'approved';
  actions2[1].status = 'pending_approval';
  actions2[2].status = 'rejected';
  actions2[2].rejectionReason = 'Baixa confianca - aguardar mais dados';

  const plan1: GrowthPlan = {
    id: `plan-${ws1}`, workspaceId: ws1, actions: prioritizeActions(actions1),
    totalActions: actions1.length, approvedActions: actions1.filter(a => a.status === 'approved').length,
    rejectedActions: actions1.filter(a => a.status === 'rejected').length,
    pendingActions: actions1.filter(a => a.status === 'pending_approval').length,
    avgPriority: actions1.reduce((s, a) => s + a.priority, 0) / actions1.length,
    risks: ['Cluster de saude pode ficar saturado', 'Concursos de TI com baixa demanda'],
    recommendations: ['Focar em concursos de saude', 'Expandir editais municipais', 'Testar titulos com "Guia Completo"'],
    createdAt: new Date().toISOString(),
  };

  const plan2: GrowthPlan = {
    id: `plan-${ws2}`, workspaceId: ws2, actions: prioritizeActions(actions2),
    totalActions: actions2.length, approvedActions: actions2.filter(a => a.status === 'approved').length,
    rejectedActions: actions2.filter(a => a.status === 'rejected').length,
    pendingActions: actions2.filter(a => a.status === 'pending_approval').length,
    avgPriority: actions2.reduce((s, a) => s + a.priority, 0) / actions2.length,
    risks: ['Risco regulatorio em criptomoedas'],
    recommendations: ['Focar em renda fixa', 'Evitar criptomoedas'],
    createdAt: new Date().toISOString(),
  };

  plans.set(ws1, plan1);
  plans.set(ws2, plan2);
}
init();

export function getGrowthService() {
  return {
    getPlan(workspaceId: string): GrowthPlan | undefined { return plans.get(workspaceId); },
    getActions(workspaceId: string): GrowthAction[] { return prioritizeActions(allActions.get(workspaceId) || []); },
    getPrioritized(workspaceId: string): { action: GrowthAction; score: ReturnType<typeof calculatePriorityScore> }[] {
      return (allActions.get(workspaceId) || []).map(a => ({ action: a, score: calculatePriorityScore(a) })).sort((a, b) => b.score.finalScore - a.score.finalScore);
    },
    approve(actionId: string): GrowthAction | undefined {
      for (const list of allActions.values()) {
        const a = list.find(x => x.id === actionId);
        if (a) { a.status = 'approved'; a.updatedAt = new Date().toISOString(); return a; }
      }
      return undefined;
    },
    reject(actionId: string, reason: string): GrowthAction | undefined {
      for (const list of allActions.values()) {
        const a = list.find(x => x.id === actionId);
        if (a) { a.status = 'rejected'; a.rejectionReason = reason; a.updatedAt = new Date().toISOString(); return a; }
      }
      return undefined;
    },
    getExecutionQueue(workspaceId: string): GrowthAction[] {
      return (allActions.get(workspaceId) || []).filter(a => a.status === 'approved').sort((a, b) => b.priority - a.priority);
    },
    analyze(workspaceId: string): GrowthPlan {
      const actions = allActions.get(workspaceId) || [];
      const plan: GrowthPlan = {
        id: `plan-${workspaceId}-${Date.now()}`, workspaceId, actions: prioritizeActions(actions),
        totalActions: actions.length, approvedActions: actions.filter(a => a.status === 'approved').length,
        rejectedActions: actions.filter(a => a.status === 'rejected').length,
        pendingActions: actions.filter(a => a.status === 'pending_approval').length,
        avgPriority: actions.length > 0 ? actions.reduce((s, a) => s + a.priority, 0) / actions.length : 0,
        risks: actions.filter(a => a.risk === 'high').map(a => a.title),
        recommendations: actions.filter(a => a.priority > 70).map(a => a.description),
        createdAt: new Date().toISOString(),
      };
      plans.set(workspaceId, plan);
      return plan;
    },
  };
}
