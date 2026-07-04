import { ApprovalRequest, AuditEntry } from './governance.types';

const pendingApprovals: ApprovalRequest[] = [];
const resolvedApprovals: ApprovalRequest[] = [];
const auditLog: AuditEntry[] = [];
let approvalCounter = 0;

export function createApprovalRequest(request: Omit<ApprovalRequest, 'id' | 'status' | 'created_at'>): ApprovalRequest {
  const req: ApprovalRequest = { ...request, id: `apr-${Date.now()}-${++approvalCounter}`, status: 'pending', created_at: new Date().toISOString() };
  pendingApprovals.push(req);
  return req;
}

export function approveRequest(id: string, resolvedBy: string, notes?: string): ApprovalRequest | null {
  const idx = pendingApprovals.findIndex(a => a.id === id);
  if (idx === -1) return null;
  const req = pendingApprovals.splice(idx, 1)[0];
  req.status = 'approved'; req.resolved_at = new Date().toISOString(); req.resolved_by = resolvedBy; req.notes = notes;
  resolvedApprovals.push(req);
  auditLog.push({ id: `audit-${Date.now()}`, workspace_id: req.workspace_id, action: req.action_type, component: 'governance', risk_level: req.risk_level, decision: 'approved', policy_id: req.policy_id, approval_id: req.id, details: `Approved by ${resolvedBy}`, timestamp: new Date().toISOString() });
  return req;
}

export function rejectRequest(id: string, resolvedBy: string, notes?: string): ApprovalRequest | null {
  const idx = pendingApprovals.findIndex(a => a.id === id);
  if (idx === -1) return null;
  const req = pendingApprovals.splice(idx, 1)[0];
  req.status = 'rejected'; req.resolved_at = new Date().toISOString(); req.resolved_by = resolvedBy; req.notes = notes;
  resolvedApprovals.push(req);
  auditLog.push({ id: `audit-${Date.now()}`, workspace_id: req.workspace_id, action: req.action_type, component: 'governance', risk_level: req.risk_level, decision: 'rejected', policy_id: req.policy_id, approval_id: req.id, details: `Rejected by ${resolvedBy}: ${notes || 'no reason'}`, timestamp: new Date().toISOString() });
  return req;
}

export function getPendingApprovals() { return pendingApprovals; }
export function getResolvedApprovals() { return resolvedApprovals; }
export function getAuditLog(limit = 50) { return auditLog.slice(-limit); }
export function addAuditEntry(entry: Omit<AuditEntry, 'id' | 'timestamp'>) {
  auditLog.push({ ...entry, id: `audit-${Date.now()}`, timestamp: new Date().toISOString() });
}
