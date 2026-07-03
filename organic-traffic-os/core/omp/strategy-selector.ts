import { Strategy, Workspace, MissionObjective } from './mission-planner.types';
import { workflowTemplates } from '../owo/workflow-templates';

const strategies: Strategy[] = [
  { id: 'evergreen', name: 'Artigo Evergreen', description: 'Artigo longo e permanente com SEO otimizado', workflowId: 'tpl-article', requiredAgents: ['content-intelligence', 'semantic-intelligence', 'authority-intelligence'], requiredWorkers: ['publishing'], estimatedDurationMinutes: 45, estimatedCost: 0.12, risks: [], bestFor: ['blog', 'saas', 'education'] },
  { id: 'update', name: 'Atualizacao de Conteudo', description: 'Refresh de conteudo existente com novos dados', workflowId: 'tpl-update', requiredAgents: ['predictive-intelligence', 'content-intelligence', 'semantic-intelligence'], requiredWorkers: ['publishing'], estimatedDurationMinutes: 25, estimatedCost: 0.06, risks: [], bestFor: ['blog', 'news', 'saas'] },
  { id: 'review', name: 'Review Comparativo', description: 'Review detalhado comparando produtos ou servicos', workflowId: 'tpl-review', requiredAgents: ['content-intelligence', 'semantic-intelligence', 'authority-intelligence'], requiredWorkers: ['publishing'], estimatedDurationMinutes: 50, estimatedCost: 0.15, risks: [], bestFor: ['blog', 'saas', 'ecommerce'] },
  { id: 'pillar', name: 'Pagina Pilar', description: 'Pagina pilar com topicos e subtopicos', workflowId: 'tpl-pillar', requiredAgents: ['content-intelligence', 'opportunity-intelligence', 'semantic-intelligence', 'authority-intelligence'], requiredWorkers: ['publishing'], estimatedDurationMinutes: 60, estimatedCost: 0.20, risks: [], bestFor: ['blog', 'saas', 'education'] },
  { id: 'faq', name: 'FAQ Completa', description: 'Pagina de perguntas frequentes estruturada', workflowId: 'tpl-article', requiredAgents: ['content-intelligence', 'semantic-intelligence'], requiredWorkers: ['publishing'], estimatedDurationMinutes: 30, estimatedCost: 0.08, risks: [], bestFor: ['saas', 'ecommerce', 'agency'] },
  { id: 'ebook', name: 'E-book', description: 'E-book completo com pesquisa e design', workflowId: 'tpl-ebook', requiredAgents: ['content-intelligence', 'semantic-intelligence', 'authority-intelligence'], requiredWorkers: ['publishing'], estimatedDurationMinutes: 120, estimatedCost: 0.35, risks: ['Tempo longo de producao'], bestFor: ['saas', 'agency', 'education'] },
  { id: 'newsletter', name: 'Newsletter', description: 'Newsletter com curadoria e envio', workflowId: 'tpl-newsletter', requiredAgents: ['content-intelligence', 'semantic-intelligence', 'authority-intelligence'], requiredWorkers: ['emails'], estimatedDurationMinutes: 20, estimatedCost: 0.05, risks: [], bestFor: ['blog', 'saas', 'agency', 'news'] },
  { id: 'landing', name: 'Landing Page', description: 'Landing page com foco em conversao', workflowId: 'tpl-landing', requiredAgents: ['opportunity-intelligence', 'semantic-intelligence'], requiredWorkers: ['publishing'], estimatedDurationMinutes: 35, estimatedCost: 0.10, risks: [], bestFor: ['saas', 'ecommerce', 'agency'] },
  { id: 'campaign', name: 'Campanha Integrada', description: 'Campanha com multiplos canais', workflowId: 'tpl-campaign', requiredAgents: ['opportunity-intelligence', 'semantic-intelligence', 'predictive-intelligence'], requiredWorkers: ['publishing', 'emails'], estimatedDurationMinutes: 90, estimatedCost: 0.30, risks: ['Requre coordenacao entre canais'], bestFor: ['saas', 'ecommerce', 'agency'] },
  { id: 'case-study', name: 'Estudo de Caso', description: 'Estudo de caso detalhado com resultados', workflowId: 'tpl-article', requiredAgents: ['content-intelligence', 'semantic-intelligence', 'authority-intelligence'], requiredWorkers: ['publishing'], estimatedDurationMinutes: 55, estimatedCost: 0.18, risks: [], bestFor: ['saas', 'agency', 'education'] },
];

export class StrategySelector {
  private strategies: Strategy[] = strategies;

  getAll(): Strategy[] {
    return this.strategies;
  }

  getById(id: string): Strategy | undefined {
    return this.strategies.find(s => s.id === id);
  }

  select(objective: MissionObjective, workspace: Workspace): Strategy {
    const contentType = objective.contentType?.toLowerCase() || '';
    const match = this.strategies.find(s => {
      if (contentType.includes('evergreen') || contentType.includes('artigo')) return s.id === 'evergreen';
      if (contentType.includes('update') || contentType.includes('atualizacao')) return s.id === 'update';
      if (contentType.includes('review') || contentType.includes('comparativ')) return s.id === 'review';
      if (contentType.includes('pillar') || contentType.includes('pilar')) return s.id === 'pillar';
      if (contentType.includes('faq')) return s.id === 'faq';
      if (contentType.includes('ebook') || contentType.includes('e-book')) return s.id === 'ebook';
      if (contentType.includes('newsletter')) return s.id === 'newsletter';
      if (contentType.includes('landing')) return s.id === 'landing';
      if (contentType.includes('campanha') || contentType.includes('campaign')) return s.id === 'campaign';
      if (contentType.includes('estudo') || contentType.includes('case')) return s.id === 'case-study';
      return false;
    });
    if (match) return match;
    return this.strategies.find(s => s.bestFor.includes(workspace.type)) || this.strategies[0];
  }
}
