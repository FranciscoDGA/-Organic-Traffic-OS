import { QAIssue, QAArea, QASeverity } from './quality.types';
import { getRules } from './quality-rules';

let issueCounter = 0;
function genId(): string { return `qa-${Date.now()}-${++issueCounter}`; }

export function validateMission(mission: { id: string; goal?: string; tasks?: unknown[]; workspace_id?: string }): QAIssue[] {
  const issues: QAIssue[] = [];
  if (!mission.goal) issues.push({ id: genId(), area: 'mission', severity: 'high', title: 'Missing goal', description: 'Missao sem objetivo', recommendation: 'Definir objetivo claro', workspace_id: mission.workspace_id, created_at: new Date().toISOString() });
  if (!mission.tasks || mission.tasks.length === 0) issues.push({ id: genId(), area: 'mission', severity: 'high', title: 'No tasks', description: 'Missao sem tasks', recommendation: 'Adicionar ao menos 1 task', workspace_id: mission.workspace_id, created_at: new Date().toISOString() });
  if (!mission.workspace_id) issues.push({ id: genId(), area: 'mission', severity: 'critical', title: 'No workspace', description: 'Missao sem workspace', recommendation: 'Associar a workspace', workspace_id: mission.workspace_id, created_at: new Date().toISOString() });
  return issues;
}

export function validateWorkflow(workflow: { id: string; steps?: unknown[]; workspace_id?: string }): QAIssue[] {
  const issues: QAIssue[] = [];
  if (!workflow.steps || workflow.steps.length === 0) issues.push({ id: genId(), area: 'workflow', severity: 'high', title: 'No steps', description: 'Workflow sem steps', recommendation: 'Adicionar ao menos 1 step', workspace_id: workflow.workspace_id, created_at: new Date().toISOString() });
  return issues;
}

export function validateAgent(agent: { id: string; specialty?: string; current_load?: number; max_load?: number; workspace_id?: string }): QAIssue[] {
  const issues: QAIssue[] = [];
  if (!agent.specialty) issues.push({ id: genId(), area: 'agent', severity: 'high', title: 'No specialty', description: 'Agent sem especialidade', recommendation: 'Definir especialidade', workspace_id: agent.workspace_id, created_at: new Date().toISOString() });
  if (agent.current_load !== undefined && agent.max_load && agent.current_load > agent.max_load) issues.push({ id: genId(), area: 'agent', severity: 'medium', title: 'Over capacity', description: 'Agent acima da capacidade', recommendation: 'Redistribuir carga', workspace_id: agent.workspace_id, created_at: new Date().toISOString() });
  return issues;
}

export function validateContent(content: { title?: string; body?: string; meta_description?: string }): QAIssue[] {
  const issues: QAIssue[] = [];
  if (!content.title) issues.push({ id: genId(), area: 'content', severity: 'high', title: 'No title', description: 'Conteudo sem titulo', recommendation: 'Adicionar titulo', created_at: new Date().toISOString() });
  if (!content.body) issues.push({ id: genId(), area: 'content', severity: 'high', title: 'No body', description: 'Conteudo sem corpo', recommendation: 'Adicionar conteudo', created_at: new Date().toISOString() });
  if (!content.meta_description) issues.push({ id: genId(), area: 'content', severity: 'medium', title: 'No meta', description: 'Conteudo sem meta description', recommendation: 'Adicionar meta description para SEO', created_at: new Date().toISOString() });
  return issues;
}

export function validateEngine(engine: { id: string; name?: string }): QAIssue[] {
  const issues: QAIssue[] = [];
  if (!engine.name) issues.push({ id: genId(), area: 'engine', severity: 'medium', title: 'No name', description: 'Engine sem nome', recommendation: 'Adicionar nome a engine', created_at: new Date().toISOString() });
  return issues;
}
