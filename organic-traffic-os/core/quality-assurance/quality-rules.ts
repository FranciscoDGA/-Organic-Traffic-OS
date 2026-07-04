import { QAIssue, QAArea, QASeverity } from './quality.types';

const rules: { area: QAArea; check: string; severity: QASeverity; description: string }[] = [
  { area: 'mission', check: 'has-goal', severity: 'high', description: 'Missao deve possuir objetivo claro' },
  { area: 'mission', check: 'has-tasks', severity: 'high', description: 'Missao deve possuir ao menos 1 task' },
  { area: 'mission', check: 'has-workspace', severity: 'critical', description: 'Missao deve estar associada a workspace' },
  { area: 'workflow', check: 'has-steps', severity: 'high', description: 'Workflow deve possuir ao menos 1 step' },
  { area: 'workflow', check: 'valid-transitions', severity: 'medium', description: 'Transicoes de estado devem ser validas' },
  { area: 'agent', check: 'has-specialty', severity: 'high', description: 'Agent deve possuir especialidade definida' },
  { area: 'agent', check: 'within-capacity', severity: 'medium', description: 'Agent nao deve exceder capacidade maxima' },
  { area: 'engine', check: 'has-input-validation', severity: 'medium', description: 'Engine deve validar inputs' },
  { area: 'content', check: 'has-title', severity: 'high', description: 'Conteudo deve possuir titulo' },
  { area: 'content', check: 'has-body', severity: 'high', description: 'Conteudo deve possuir corpo' },
  { area: 'content', check: 'seo-valid', severity: 'medium', description: 'Conteudo deve atender basicamente SEO' },
  { area: 'publishing', check: 'has-approval', severity: 'critical', description: 'Publicacao requer aprovacao' },
  { area: 'scheduler', check: 'valid-schedule', severity: 'medium', description: 'Agendamento deve ser valido' },
  { area: 'runtime', check: 'health-check', severity: 'low', description: 'Runtime deve estar saudavel' },
];

export function getRules() { return rules; }
export function getRulesByArea(area: QAArea) { return rules.filter(r => r.area === area); }
