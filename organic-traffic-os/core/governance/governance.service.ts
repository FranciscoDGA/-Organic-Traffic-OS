import { Policy, ApprovalRequest, AuditEntry, RiskAssessment, PolicyAction, RiskLevel } from './governance.types';
import { getAllPolicies, getActivePolicies, getPoliciesByScope, getPoliciesByWorkspace } from './policy-manager';
import { createApprovalRequest, approveRequest, rejectRequest, getPendingApprovals, getResolvedApprovals, getAuditLog, addAuditEntry } from './approval-manager';
import { calculateRisk, getRiskLevel } from './risk-checker';
import { checkPermission, hasPermission, getPermissions } from './permission-checker';

let checkCounter = 0;

export function getGovernanceService() {
  return {
    checkAction(params: { actionType: string; workspaceId: string; targetWorkspaceId?: string; component?: string; costEstimate?: number; tokenEstimate?: number; requestedBy?: string }) {
      const { actionType, workspaceId, targetWorkspaceId, component, costEstimate, tokenEstimate, requestedBy } = params;
      const policies = getPoliciesByWorkspace(workspaceId);
      const relevantPolicy = policies.find(p => p.rule === actionType || actionType.includes(p.scope));
      const risk = calculateRisk({ actionType, workspaceId, targetWorkspaceId, costEstimate, tokenEstimate });
      const riskLevel = getRiskLevel(risk.overall);
      const hasPerm = component ? hasPermission(component, actionType) : true;
      const checkId = `chk-${Date.now()}-${++checkCounter}`;
      let decision: 'allowed' | 'denied' | 'pending' | 'approved' | 'rejected' = 'allowed';
      let approvalRequest: ApprovalRequest | null = null;

      if (relevantPolicy?.action === 'deny') { decision = 'denied'; }
      else if (relevantPolicy?.requires_approval || riskLevel === 'critical' || riskLevel === 'high') {
        decision = 'pending';
        approvalRequest = createApprovalRequest({ workspace_id: workspaceId, action_type: actionType, description: `Governance check: ${actionType}`, requested_by: requestedBy || 'system', policy_id: relevantPolicy?.id, risk_level: riskLevel });
      }

      addAuditEntry({ workspace_id: workspaceId, action: actionType, component: component || 'unknown', risk_level: riskLevel, decision, policy_id: relevantPolicy?.id, approval_id: approvalRequest?.id, details: `Check ${checkId}: risk=${risk.overall}, permission=${hasPerm}` });

      return { checkId, decision, risk, riskLevel, relevantPolicy, approvalRequest, hasPermission: hasPerm };
    },
    approve(id: string, resolvedBy: string, notes?: string) { return approveRequest(id, resolvedBy, notes); },
    reject(id: string, resolvedBy: string, notes?: string) { return rejectRequest(id, resolvedBy, notes); },
    getPolicies() { return getAllPolicies(); },
    getActivePolicies() { return getActivePolicies(); },
    getPendingApprovals() { return getPendingApprovals(); },
    getResolvedApprovals() { return getResolvedApprovals(); },
    getAuditLog(limit?: number) { return getAuditLog(limit); },
    getPermissions() { return getPermissions(); },
    checkPermission(component: string, action: string) { return checkPermission(component, action); },
  };
}
