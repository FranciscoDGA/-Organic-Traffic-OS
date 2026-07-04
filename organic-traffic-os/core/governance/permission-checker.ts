export interface Permission { id: string; component: string; action: string; scope: string; allowed: boolean; }

const defaultPermissions: Permission[] = [
  { id: 'perm-001', component: 'orchestrator', action: 'execute-workflow', scope: 'all', allowed: true },
  { id: 'perm-002', component: 'runtime', action: 'start-job', scope: 'all', allowed: true },
  { id: 'perm-003', component: 'scheduler', action: 'schedule-job', scope: 'all', allowed: true },
  { id: 'perm-004', component: 'mission-control', action: 'create-mission', scope: 'all', allowed: true },
  { id: 'perm-005', component: 'strategic-director', action: 'make-decision', scope: 'all', allowed: true },
  { id: 'perm-006', component: 'opportunity-manager', action: 'detect-opportunity', scope: 'all', allowed: true },
  { id: 'perm-007', component: 'wordpress', action: 'publish-content', scope: 'publishing', allowed: false },
  { id: 'perm-008', component: 'newsletter', action: 'send-email', scope: 'publishing', allowed: false },
  { id: 'perm-009', component: 'agents', action: 'delete-content', scope: 'content', allowed: false },
  { id: 'perm-010', component: 'strategic-director', action: 'change-strategy', scope: 'strategy', allowed: false },
];

export function checkPermission(component: string, action: string): Permission | null {
  return defaultPermissions.find(p => p.component === component && p.action === action) || null;
}

export function hasPermission(component: string, action: string): boolean {
  const perm = checkPermission(component, action);
  return perm ? perm.allowed : true;
}

export function getPermissions() { return defaultPermissions; }
