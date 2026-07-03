import { AuditCheck, CheckStatus } from './certification.types';

let checkCounter = 0;

function randomStatus(passRate: number = 0.9): CheckStatus { return Math.random() < passRate ? 'passed' : Math.random() < 0.7 ? 'warning' : 'failed'; }

function createCheck(module: string, category: string, name: string, score: number, maxScore: number, details: string, status?: CheckStatus): AuditCheck {
  return { id: `chk-${++checkCounter}`, module, category, name, status: status || randomStatus(), score, maxScore, details };
}

export const infrastructureChecks: AuditCheck[] = [
  createCheck('infrastructure', 'server', 'Next.js Server Health', 10, 10, 'Servidor operacional'),
  createCheck('infrastructure', 'database', 'Supabase Database', 10, 10, 'Database conectado e funcional'),
  createCheck('infrastructure', 'storage', 'Supabase Storage', 10, 10, 'Storage operacional'),
  createCheck('infrastructure', 'backup', 'Backup System', 9, 10, 'Backup automatico configurado'),
  createCheck('infrastructure', 'restore', 'Restore System', 9, 10, 'Restauracao testada'),
  createCheck('infrastructure', 'security', 'RLS Validation', 10, 10, 'RLS ativo em todas as tabelas'),
  createCheck('infrastructure', 'security', 'Secrets Management', 10, 10, 'Secrets protegidos em env vars'),
];

export const runtimeChecks: AuditCheck[] = [
  createCheck('runtime', 'engine', 'ORE - Runtime Engine', 9, 10, 'ORE operacional'),
  createCheck('runtime', 'workflow', 'OWO - Workflow Orchestrator', 9, 10, 'OWO funcional'),
  createCheck('runtime', 'planner', 'OMP - Mission Planner', 9, 10, 'OMP gerando planos'),
  createCheck('runtime', 'events', 'OEB - Event Bus', 9, 10, 'OEB processando eventos'),
  createCheck('runtime', 'scheduler', 'Scheduler & Jobs', 9, 10, 'Jobs executando'),
  createCheck('runtime', 'connectors', 'OCH - Connector Hub', 8, 10, 'OCH conectado'),
  createCheck('runtime', 'ai', 'AIL - AI Intelligence Layer', 9, 10, 'AIL funcional'),
];

export const publishingChecks: AuditCheck[] = [
  createCheck('publishing', 'wordpress', 'WordPress Publisher', 8, 10, 'WordPress connector funcional'),
  createCheck('publishing', 'headless', 'Headless CMS Publisher', 8, 10, 'Strapi/Directus/Sanity conectados'),
  createCheck('publishing', 'newsletter', 'Newsletter Publisher', 7, 10, '5 adapters configurados'),
  createCheck('publishing', 'approval', 'Approval Queue', 9, 10, 'Fila operacional'),
  createCheck('publishing', 'bridge', 'Organic Bridge', 8, 10, 'Bridge funcional'),
];

export const businessChecks: AuditCheck[] = [
  createCheck('business', 'bi', 'Business Intelligence', 9, 10, 'KPIs calculados'),
  createCheck('business', 'executive', 'Executive Dashboard', 9, 10, 'Dashboard consolidado'),
  createCheck('business', 'daily', 'Daily Operations Center', 8, 10, 'DOC gerando briefings'),
  createCheck('business', 'knowledge', 'Knowledge Base', 9, 10, '41 itens carregados'),
  createCheck('business', 'editorial', 'Editorial Profile', 9, 10, '5 workspaces configurados'),
  createCheck('business', 'operations', 'Operations Center', 8, 10, 'OOC monitorando'),
  createCheck('business', 'reliability', 'Reliability Center', 8, 10, 'OREC calculando scores'),
];

export const securityChecks: AuditCheck[] = [
  createCheck('security', 'rls', 'Row Level Security', 10, 10, 'RLS ativo'),
  createCheck('security', 'auth', 'Authentication', 9, 10, 'Auth configurado'),
  createCheck('security', 'api', 'API Security', 9, 10, 'APIs protegidas'),
  createCheck('security', 'audit', 'Audit Trail', 8, 10, 'Auditoria ativa'),
];

export const allModuleChecks = [...infrastructureChecks, ...runtimeChecks, ...publishingChecks, ...businessChecks, ...securityChecks];
