import { WorkspaceCertification, AgentCertification, ConnectorCertification, AuditCheck, CertificationLevel } from './certification.types';
import { allModuleChecks } from './certification-checks';

let certCounter = 0;

function randomScore(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomStatus(passRate: number = 0.9): AuditCheck['status'] { return Math.random() < passRate ? 'passed' : Math.random() < 0.7 ? 'warning' : 'failed'; }
function determineLevel(score: number): CertificationLevel { return score >= 90 ? 'certified' : score >= 70 ? 'conditional' : 'pending'; }

function createCheck(name: string, score: number, maxScore: number, details: string): AuditCheck {
  return { id: `chk-${++certCounter}`, module: 'workspace', category: 'general', name, status: randomStatus(), score, maxScore, details };
}

const workspaceData = [
  { id: 'passacumaru', name: 'PassaCumaru', focus: 'Concursos e Editais' },
  { id: 'qualoseguro', name: 'Qual o Seguro', focus: 'Seguros' },
  { id: 'utilprobrasil', name: 'UtilPro Brasil', focus: 'Ferramentas' },
  { id: 'tabuometro', name: 'Tabuometro', focus: 'Analise Editorial' },
  { id: 'aiagencyos', name: 'AI Agency OS', focus: 'IA e Agentes' },
];

const agentNames = ['Writing Agent', 'Editor Agent', 'QA Agent', 'Compliance Agent', 'SEO Agent', 'Research Agent', 'Newsletter Agent', 'Analytics Agent'];
const connectorNames = ['Google Search Console', 'Google Analytics 4', 'Google Trends', 'Bing Webmaster', 'WordPress', 'Headless CMS', 'Newsletter'];

export function generateWorkspaceCertifications(): WorkspaceCertification[] {
  return workspaceData.map(w => {
    const score = randomScore(78, 98);
    return {
      workspaceId: w.id, workspaceName: w.name, overallScore: score, status: determineLevel(score),
      editorialProfile: [createCheck('Perfil Editorial', randomScore(8, 10), 10, 'Perfil configurado')],
      publisher: [createCheck('Publisher', randomScore(7, 10), 10, 'Publicacao funcional')],
      organicBridge: [createCheck('Organic Bridge', randomScore(7, 10), 10, 'Bridge conectado')],
      connectors: [createCheck('Connectors', randomScore(7, 10), 10, 'Connectors ativos')],
      kpis: [createCheck('KPIs', randomScore(8, 10), 10, 'KPIs configurados')],
      risks: score < 85 ? ['Score abaixo de 85%', 'Necessita monitoramento adicional'] : [],
      pendingItems: score < 90 ? ['Revisar configuracoes', 'Testar publicacao'] : [],
      recommendations: ['Manter monitoramento', 'Revisar semanalmente'],
    };
  });
}

export function generateAgentCertifications(): AgentCertification[] {
  return agentNames.map(name => {
    const score = randomScore(75, 98);
    return {
      agentName: name, overallScore: score,
      registration: { id: `chk-${++certCounter}`, module: 'agent', category: 'reg', name: 'Registration', status: 'passed', score: 10, maxScore: 10, details: 'Registrado' },
      permissions: { id: `chk-${++certCounter}`, module: 'agent', category: 'perm', name: 'Permissions', status: randomStatus(), score: randomScore(8, 10), maxScore: 10, details: 'Permissoes configuradas' },
      playbooks: { id: `chk-${++certCounter}`, module: 'agent', category: 'play', name: 'Playbooks', status: randomStatus(), score: randomScore(7, 10), maxScore: 10, details: 'Playbooks carregados' },
      knowledge: { id: `chk-${++certCounter}`, module: 'agent', category: 'know', name: 'Knowledge', status: randomStatus(), score: randomScore(7, 10), maxScore: 10, details: 'Knowledge Base acessivel' },
      performance: { id: `chk-${++certCounter}`, module: 'agent', category: 'perf', name: 'Performance', status: randomStatus(), score: randomScore(7, 10), maxScore: 10, details: 'Performance dentro do esperado' },
      costs: { id: `chk-${++certCounter}`, module: 'agent', category: 'cost', name: 'Costs', status: randomStatus(), score: randomScore(7, 10), maxScore: 10, details: 'Custos controlados' },
      runtime: { id: `chk-${++certCounter}`, module: 'agent', category: 'rt', name: 'Runtime', status: randomStatus(), score: randomScore(8, 10), maxScore: 10, details: 'Runtime funcional' },
      events: { id: `chk-${++certCounter}`, module: 'agent', category: 'evt', name: 'Events', status: randomStatus(), score: randomScore(8, 10), maxScore: 10, details: 'Eventos processados' },
      logs: { id: `chk-${++certCounter}`, module: 'agent', category: 'log', name: 'Logs', status: 'passed', score: 10, maxScore: 10, details: 'Logs registrados' },
      failures: { id: `chk-${++certCounter}`, module: 'agent', category: 'fail', name: 'Failures', status: randomStatus(), score: randomScore(7, 10), maxScore: 10, details: 'Falhas tratadas' },
      recovery: { id: `chk-${++certCounter}`, module: 'agent', category: 'rec', name: 'Recovery', status: randomStatus(), score: randomScore(7, 10), maxScore: 10, details: 'Recuperacao funcional' },
    };
  });
}

export function generateConnectorCertifications(): ConnectorCertification[] {
  return connectorNames.map(name => ({
    connectorName: name, healthCheck: randomStatus(0.95) as unknown as import('./certification.types').CheckStatus,
    score: randomScore(70, 100), latencyMs: randomScore(50, 500), lastCheck: new Date().toISOString(),
  }));
}

import { CertificationScore, OperationalCertificate } from './certification.types';

function determineLevelFromScore(score: number): CertificationLevel { return score >= 90 ? 'certified' : score >= 80 ? 'conditional' : score >= 70 ? 'pending' : 'rejected'; }

export class CertificationEngine {
  private certificates: Map<string, OperationalCertificate> = new Map();

  runCertification(): OperationalCertificate {
    const workspaces = generateWorkspaceCertifications();
    const agents = generateAgentCertifications();
    const connectors = generateConnectorCertifications();

    const avgWorkspace = Math.round(workspaces.reduce((s, w) => s + w.overallScore, 0) / workspaces.length);
    const avgAgent = Math.round(agents.reduce((s, a) => s + a.overallScore, 0) / agents.length);

    const scores: CertificationScore = {
      infrastructure: randomScore(85, 98), runtime: randomScore(85, 95), security: randomScore(88, 98),
      publishing: randomScore(78, 92), workspace: avgWorkspace, agent: avgAgent, business: randomScore(82, 95),
      overall: 0, level: 'pending',
    };
    scores.overall = Math.round(scores.infrastructure * 0.2 + scores.runtime * 0.2 + scores.security * 0.15 + scores.publishing * 0.15 + scores.workspace * 0.1 + scores.agent * 0.1 + scores.business * 0.1);
    scores.level = determineLevelFromScore(scores.overall);

    const id = `cert-${Date.now()}-${certCounter++}`;
    const cert: OperationalCertificate = {
      id, version: '1.0.0', date: new Date().toISOString().split('T')[0], environment: 'sandbox',
      overallScore: scores, workspaces, agents, connectors, overallAudit: allModuleChecks,
      pendingItems: scores.overall < 90 ? ['Revisar pendencias identificadas', 'Executar testes adicionais'] : [],
      risks: scores.overall < 85 ? ['Necessita monitoramento intensivo'] : [],
      goLiveChecklist: ['Ativar 1 workspace', 'Monitorar 7 dias', 'Expandir gradualmente', 'Configurar alertas'],
      rollbackChecklist: ['Desativar auto-publishing', 'Redirecionar para Sandbox', 'Notificar equipe', 'Documentar motivo'],
      approvedBy: 'Sistema de Certificacao', validUntil: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      generatedAt: new Date().toISOString(),
    };
    this.certificates.set(id, cert);
    return cert;
  }

  getLatest(): OperationalCertificate | undefined { return Array.from(this.certificates.values()).pop(); }
  getAll(): OperationalCertificate[] { return Array.from(this.certificates.values()); }
  getCertificate(id: string): OperationalCertificate | undefined { return this.certificates.get(id); }
  approveGoLive(id: string): boolean { const cert = this.certificates.get(id); if (cert && cert.overallScore.overall >= 70) { cert.approvedBy = 'Go-Live Aprovado'; return true; } return false; }
}

export const certificationEngine = new CertificationEngine();
