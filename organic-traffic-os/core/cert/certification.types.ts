export type CheckStatus = 'passed' | 'failed' | 'warning' | 'pending' | 'skipped';
export type CertificationLevel = 'certified' | 'conditional' | 'pending' | 'rejected';

export interface AuditCheck {
  id: string;
  module: string;
  category: string;
  name: string;
  status: CheckStatus;
  score: number;
  maxScore: number;
  details: string;
}

export interface WorkspaceCertification {
  workspaceId: string;
  workspaceName: string;
  overallScore: number;
  editorialProfile: AuditCheck[];
  publisher: AuditCheck[];
  organicBridge: AuditCheck[];
  connectors: AuditCheck[];
  kpis: AuditCheck[];
  risks: string[];
  pendingItems: string[];
  recommendations: string[];
  status: CertificationLevel;
}

export interface AgentCertification {
  agentName: string;
  overallScore: number;
  registration: AuditCheck;
  permissions: AuditCheck;
  playbooks: AuditCheck;
  knowledge: AuditCheck;
  performance: AuditCheck;
  costs: AuditCheck;
  runtime: AuditCheck;
  events: AuditCheck;
  logs: AuditCheck;
  failures: AuditCheck;
  recovery: AuditCheck;
}

export interface ConnectorCertification {
  connectorName: string;
  healthCheck: CheckStatus;
  score: number;
  latencyMs: number;
  lastCheck: string;
}

export interface CertificationScore {
  infrastructure: number;
  runtime: number;
  security: number;
  publishing: number;
  workspace: number;
  agent: number;
  business: number;
  overall: number;
  level: CertificationLevel;
}

export interface OperationalCertificate {
  id: string;
  version: string;
  date: string;
  environment: string;
  overallScore: CertificationScore;
  workspaces: WorkspaceCertification[];
  agents: AgentCertification[];
  connectors: ConnectorCertification[];
  overallAudit: AuditCheck[];
  pendingItems: string[];
  risks: string[];
  goLiveChecklist: string[];
  rollbackChecklist: string[];
  approvedBy: string;
  validUntil: string;
  generatedAt: string;
}

export interface CertificationReport {
  executiveSummary: string;
  infrastructureReport: string;
  workspaceReport: string;
  agentReport: string;
  connectorReport: string;
  securityReport: string;
  businessReport: string;
  riskAssessment: string;
}
