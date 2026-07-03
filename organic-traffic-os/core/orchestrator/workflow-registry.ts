import { WorkflowDefinition, WorkflowStep } from './orchestrator.types';

const WORKFLOWS: WorkflowDefinition[] = [
  {
    id: 'full-seo-cycle',
    name: 'Ciclo SEO Completo',
    version: '1.0.0',
    description: 'Executa o ciclo completo: Discovery → Research → Planning → Writing → Review → Publishing → Monitoring',
    steps: [
      { id: 'discovery', name: 'Discovery Agent', type: 'agent', target: 'discovery', depends_on: [], timeout_ms: 60000, retry_policy: { max_retries: 2, delay_ms: 5000 } },
      { id: 'research', name: 'Research Agent', type: 'agent', target: 'research', depends_on: ['discovery'], timeout_ms: 120000, retry_policy: { max_retries: 2, delay_ms: 5000 } },
      { id: 'planning', name: 'Planning Agent', type: 'agent', target: 'planning', depends_on: ['research'], timeout_ms: 60000, retry_policy: { max_retries: 2, delay_ms: 5000 } },
      { id: 'writing', name: 'Writer Agent', type: 'agent', target: 'writer', depends_on: ['planning'], timeout_ms: 180000, retry_policy: { max_retries: 1, delay_ms: 10000 } },
      { id: 'review', name: 'Review Agent', type: 'agent', target: 'review', depends_on: ['writing'], timeout_ms: 60000, retry_policy: { max_retries: 1, delay_ms: 5000 } },
      { id: 'publishing', name: 'Publishing Agent', type: 'agent', target: 'publishing', depends_on: ['review'], timeout_ms: 60000, retry_policy: { max_retries: 2, delay_ms: 5000 } },
      { id: 'monitoring', name: 'Monitoring Agent', type: 'agent', target: 'monitoring', depends_on: ['publishing'], timeout_ms: 60000, retry_policy: { max_retries: 2, delay_ms: 5000 } },
    ],
    timeout_ms: 600000,
    retry_policy: { max_retries: 1, delay_ms: 10000 },
    priority: 'high',
    status: 'active',
  },
  {
    id: 'content-creation',
    name: 'Criação de Conteúdo',
    version: '1.0.0',
    description: 'Pipeline de criação: Research → Planning → Writing → Review',
    steps: [
      { id: 'research', name: 'Research Agent', type: 'agent', target: 'research', depends_on: [], timeout_ms: 120000, retry_policy: { max_retries: 2, delay_ms: 5000 } },
      { id: 'planning', name: 'Planning Agent', type: 'agent', target: 'planning', depends_on: ['research'], timeout_ms: 60000, retry_policy: { max_retries: 2, delay_ms: 5000 } },
      { id: 'writing', name: 'Writer Agent', type: 'agent', target: 'writer', depends_on: ['planning'], timeout_ms: 180000, retry_policy: { max_retries: 1, delay_ms: 10000 } },
      { id: 'review', name: 'Review Agent', type: 'agent', target: 'review', depends_on: ['writing'], timeout_ms: 60000, retry_policy: { max_retries: 1, delay_ms: 5000 } },
    ],
    timeout_ms: 420000,
    retry_policy: { max_retries: 1, delay_ms: 10000 },
    priority: 'medium',
    status: 'active',
  },
  {
    id: 'data-collection',
    name: 'Coleta de Dados',
    version: '1.0.0',
    description: 'Executa todos os Connectors para coleta de dados',
    steps: [
      { id: 'gsc-sync', name: 'GSC Sync', type: 'connector', target: 'google-search-console', depends_on: [], timeout_ms: 30000, retry_policy: { max_retries: 3, delay_ms: 3000 } },
      { id: 'ga4-sync', name: 'GA4 Sync', type: 'connector', target: 'google-analytics-4', depends_on: [], timeout_ms: 30000, retry_policy: { max_retries: 3, delay_ms: 3000 } },
      { id: 'bing-sync', name: 'Bing Sync', type: 'connector', target: 'bing-webmaster', depends_on: [], timeout_ms: 30000, retry_policy: { max_retries: 3, delay_ms: 3000 } },
      { id: 'trends-sync', name: 'Trends Sync', type: 'connector', target: 'google-trends', depends_on: [], timeout_ms: 30000, retry_policy: { max_retries: 3, delay_ms: 3000 } },
      { id: 'rss-sync', name: 'RSS Sync', type: 'connector', target: 'rss-sitemap', depends_on: [], timeout_ms: 30000, retry_policy: { max_retries: 3, delay_ms: 3000 } },
    ],
    timeout_ms: 180000,
    retry_policy: { max_retries: 2, delay_ms: 5000 },
    priority: 'medium',
    status: 'active',
  },
  {
    id: 'intelligence-analysis',
    name: 'Análise de Inteligência',
    version: '1.0.0',
    description: 'Executa todas as Intelligence Engines em sequência',
    steps: [
      { id: 'content-intel', name: 'Content Intelligence', type: 'engine', target: 'content-intelligence', depends_on: [], timeout_ms: 60000, retry_policy: { max_retries: 2, delay_ms: 5000 } },
      { id: 'semantic-intel', name: 'Semantic Intelligence', type: 'engine', target: 'semantic-intelligence', depends_on: ['content-intel'], timeout_ms: 60000, retry_policy: { max_retries: 2, delay_ms: 5000 } },
      { id: 'authority-intel', name: 'Authority Intelligence', type: 'engine', target: 'authority-intelligence', depends_on: ['semantic-intel'], timeout_ms: 60000, retry_policy: { max_retries: 2, delay_ms: 5000 } },
      { id: 'opportunity-intel', name: 'Opportunity Intelligence', type: 'engine', target: 'opportunity-intelligence', depends_on: ['authority-intel'], timeout_ms: 60000, retry_policy: { max_retries: 2, delay_ms: 5000 } },
      { id: 'predictive-intel', name: 'Predictive Intelligence', type: 'engine', target: 'predictive-intelligence', depends_on: ['opportunity-intel'], timeout_ms: 60000, retry_policy: { max_retries: 2, delay_ms: 5000 } },
    ],
    timeout_ms: 360000,
    retry_policy: { max_retries: 1, delay_ms: 10000 },
    priority: 'high',
    status: 'active',
  },
  {
    id: 'publish-pipeline',
    name: 'Pipeline de Publicação',
    version: '1.0.0',
    description: 'Review → Publishing → Monitoring para conteúdo existente',
    steps: [
      { id: 'review', name: 'Review Agent', type: 'agent', target: 'review', depends_on: [], timeout_ms: 60000, retry_policy: { max_retries: 1, delay_ms: 5000 } },
      { id: 'publishing', name: 'Publishing Agent', type: 'agent', target: 'publishing', depends_on: ['review'], timeout_ms: 60000, retry_policy: { max_retries: 2, delay_ms: 5000 } },
      { id: 'monitoring', name: 'Monitoring Agent', type: 'agent', target: 'monitoring', depends_on: ['publishing'], timeout_ms: 60000, retry_policy: { max_retries: 2, delay_ms: 5000 } },
    ],
    timeout_ms: 240000,
    retry_policy: { max_retries: 1, delay_ms: 10000 },
    priority: 'medium',
    status: 'active',
  },
];

export class WorkflowRegistry {
  private workflows: Map<string, WorkflowDefinition> = new Map();

  constructor() {
    for (const wf of WORKFLOWS) {
      this.workflows.set(wf.id, wf);
    }
  }

  getWorkflow(id: string): WorkflowDefinition | undefined {
    return this.workflows.get(id);
  }

  getAllWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  getActiveWorkflows(): WorkflowDefinition[] {
    return this.getAllWorkflows().filter(w => w.status === 'active');
  }

  registerWorkflow(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.id, workflow);
  }

  getWorkflowsByPriority(priority: WorkflowDefinition['priority']): WorkflowDefinition[] {
    return this.getActiveWorkflows().filter(w => w.priority === priority);
  }
}
