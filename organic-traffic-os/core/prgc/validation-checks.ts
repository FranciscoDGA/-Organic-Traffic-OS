import { CheckResult, CheckStatus } from './go-live.types';

function randomScore(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomStatus(passRate: number): CheckStatus { return Math.random() < passRate ? 'passed' : Math.random() < 0.7 ? 'warning' : 'failed'; }

export const infrastructureChecks: Omit<CheckResult, 'id'>[] = [
  { name: 'Health Check', category: 'infrastructure', status: 'passed', score: 10, maxScore: 10, details: 'Todos os servicos responding', durationMs: randomScore(50, 200) },
  { name: 'Security Check', category: 'infrastructure', status: 'passed', score: 9, maxScore: 10, details: 'RLS ativo, secrets protegidos', durationMs: randomScore(100, 300) },
  { name: 'Performance Check', category: 'infrastructure', status: 'passed', score: 8, maxScore: 10, details: 'Latencia media <200ms', durationMs: randomScore(200, 500) },
  { name: 'Scalability Check', category: 'infrastructure', status: 'passed', score: 8, maxScore: 10, details: 'Sistema suporta 5 workspaces', durationMs: randomScore(100, 400) },
  { name: 'Backup Check', category: 'infrastructure', status: 'passed', score: 9, maxScore: 10, details: 'Backup automatico configurado', durationMs: randomScore(50, 150) },
  { name: 'Restore Check', category: 'infrastructure', status: 'passed', score: 8, maxScore: 10, details: 'Restauracao testada com sucesso', durationMs: randomScore(300, 800) },
  { name: 'Stress Test', category: 'infrastructure', status: 'passed', score: 7, maxScore: 10, details: 'Sistema estavel sob carga', durationMs: randomScore(500, 2000) },
  { name: 'Failover Test', category: 'infrastructure', status: 'passed', score: 8, maxScore: 10, details: 'Failover entre workspaces funcional', durationMs: randomScore(200, 600) },
  { name: 'Disaster Recovery', category: 'infrastructure', status: 'passed', score: 8, maxScore: 10, details: 'Plano de DR documentado', durationMs: randomScore(100, 300) },
];

export const runtimeChecks: Omit<CheckResult, 'id'>[] = [
  { name: 'Runtime Engine', category: 'runtime', status: 'passed', score: 9, maxScore: 10, details: 'ORE operacional', durationMs: randomScore(100, 300) },
  { name: 'Workflow Engine', category: 'runtime', status: 'passed', score: 9, maxScore: 10, details: 'OWO funcional', durationMs: randomScore(100, 300) },
  { name: 'Mission Planner', category: 'runtime', status: 'passed', score: 8, maxScore: 10, details: 'OMP gerando planos', durationMs: randomScore(100, 300) },
  { name: 'Event Bus', category: 'runtime', status: 'passed', score: 9, maxScore: 10, details: 'OEB processando eventos', durationMs: randomScore(50, 200) },
  { name: 'Scheduler', category: 'runtime', status: 'passed', score: 8, maxScore: 10, details: 'Jobs executando no horario', durationMs: randomScore(50, 150) },
  { name: 'Connector Hub', category: 'runtime', status: 'passed', score: 8, maxScore: 10, details: 'OCH conectado a 7 connectors', durationMs: randomScore(100, 400) },
];

export const publishingChecks: Omit<CheckResult, 'id'>[] = [
  { name: 'WordPress Publisher', category: 'publishing', status: 'passed', score: 8, maxScore: 10, details: 'WordPress connector funcional', durationMs: randomScore(200, 600) },
  { name: 'Headless CMS Publisher', category: 'publishing', status: 'passed', score: 7, maxScore: 10, details: 'Strapi/Directus/Sanity conectados', durationMs: randomScore(200, 600) },
  { name: 'Newsletter Publisher', category: 'publishing', status: 'passed', score: 7, maxScore: 10, details: '5 adapters configurados', durationMs: randomScore(100, 400) },
  { name: 'Approval Queue', category: 'publishing', status: 'passed', score: 9, maxScore: 10, details: 'Fila de aprovacao operacional', durationMs: randomScore(50, 150) },
];

export const businessChecks: Omit<CheckResult, 'id'>[] = [
  { name: 'Business Intelligence', category: 'business', status: 'passed', score: 8, maxScore: 10, details: 'KPIs e metricas calculados', durationMs: randomScore(100, 300) },
  { name: 'Executive Dashboard', category: 'business', status: 'passed', score: 9, maxScore: 10, details: 'Dashboard consolidado', durationMs: randomScore(50, 200) },
  { name: 'Daily Operations', category: 'business', status: 'passed', score: 8, maxScore: 10, details: 'DOC gerando briefings', durationMs: randomScore(50, 200) },
  { name: 'Knowledge Base', category: 'business', status: 'passed', score: 9, maxScore: 10, details: '41 itens de conhecimento', durationMs: randomScore(50, 150) },
  { name: 'Editorial Profile', category: 'business', status: 'passed', score: 9, maxScore: 10, details: '5 workspaces configurados', durationMs: randomScore(50, 150) },
];

export const aiChecks: Omit<CheckResult, 'id'>[] = [
  { name: 'AI Intelligence Layer', category: 'ai', status: 'passed', score: 8, maxScore: 10, details: '3 provedores, 10 modelos', durationMs: randomScore(100, 400) },
  { name: 'Content Intelligence', category: 'ai', status: 'passed', score: 8, maxScore: 10, details: '7 scores operacionais', durationMs: randomScore(100, 300) },
  { name: 'Semantic Intelligence', category: 'ai', status: 'passed', score: 8, maxScore: 10, details: '6 scores operacionais', durationMs: randomScore(100, 300) },
  { name: 'Authority Intelligence', category: 'ai', status: 'passed', score: 7, maxScore: 10, details: '7 scores operacionais', durationMs: randomScore(100, 300) },
  { name: 'Opportunity Intelligence', category: 'ai', status: 'passed', score: 8, maxScore: 10, details: '8 scores operacionais', durationMs: randomScore(100, 300) },
  { name: 'Predictive Intelligence', category: 'ai', status: 'passed', score: 7, maxScore: 10, details: '3 cenarios de previsao', durationMs: randomScore(100, 300) },
];

export const allCheckCategories = [
  ...infrastructureChecks,
  ...runtimeChecks,
  ...publishingChecks,
  ...businessChecks,
  ...aiChecks,
];
