export type PolicyScope = 'content' | 'publishing' | 'newsletter' | 'strategy' | 'mission' | 'connector' | 'data' | 'ai' | 'budget' | 'execution';
export type PolicyAction = 'allow' | 'deny' | 'require-approval' | 'require-review';
export type PolicySeverity = 'critical' | 'high' | 'medium' | 'low';
export type PolicyStatus = 'active' | 'inactive' | 'draft';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'none';

export interface Policy {
  id: string;
  workspace_id?: string;
  name: string;
  description: string;
  scope: PolicyScope;
  rule: string;
  severity: PolicySeverity;
  action: PolicyAction;
  requires_approval: boolean;
  status: PolicyStatus;
  created_at: string;
  updated_at: string;
}

export interface ApprovalRequest {
  id: string;
  workspace_id: string;
  action_type: string;
  description: string;
  requested_by: string;
  policy_id?: string;
  risk_level: RiskLevel;
  status: ApprovalStatus;
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
  notes?: string;
}

export interface AuditEntry {
  id: string;
  workspace_id: string;
  action: string;
  component: string;
  risk_level: RiskLevel;
  decision: 'allowed' | 'denied' | 'pending' | 'approved' | 'rejected';
  policy_id?: string;
  approval_id?: string;
  details: string;
  timestamp: string;
}

export interface RiskAssessment {
  operational: number;
  editorial: number;
  financial: number;
  seo: number;
  publishing: number;
  data: number;
  cross_workspace: number;
  overall: number;
}
