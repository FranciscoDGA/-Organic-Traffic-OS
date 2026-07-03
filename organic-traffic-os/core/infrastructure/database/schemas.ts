export const DATABASE_SCHEMAS = [
  'core',
  'workspaces',
  'missions',
  'agents',
  'runtime',
  'publisher',
  'campaigns',
  'knowledge',
  'memory',
  'playbooks',
  'business',
  'analytics',
  'audit',
  'system',
  'security',
  'logs',
  'settings',
  'users',
] as const;

export type DatabaseSchema = typeof DATABASE_SCHEMAS[number];

export interface SchemaDefinition {
  name: DatabaseSchema;
  description: string;
  tables: string[];
  createdAt: string;
}

export const SCHEMA_DEFINITIONS: Record<DatabaseSchema, SchemaDefinition> = {
  core: { name: 'core', description: 'Core system tables', tables: ['organizations', 'tenants', 'features'], createdAt: new Date().toISOString() },
  workspaces: { name: 'workspaces', description: 'Workspace management', tables: ['workspaces', 'workspace_members', 'workspace_settings'], createdAt: new Date().toISOString() },
  missions: { name: 'missions', description: 'Mission and campaign tracking', tables: ['missions', 'mission_steps', 'mission_logs'], createdAt: new Date().toISOString() },
  agents: { name: 'agents', description: 'AI Agent definitions and state', tables: ['agents', 'agent_states', 'agent_logs'], createdAt: new Date().toISOString() },
  runtime: { name: 'runtime', description: 'Runtime engine state', tables: ['runtime_modules', 'runtime_events', 'runtime_heartbeats'], createdAt: new Date().toISOString() },
  publisher: { name: 'publisher', description: 'Content publishing pipeline', tables: ['articles', 'drafts', 'publications', 'schedules'], createdAt: new Date().toISOString() },
  campaigns: { name: 'campaigns', description: 'Marketing campaigns', tables: ['campaigns', 'campaign_metrics', 'campaign_targets'], createdAt: new Date().toISOString() },
  knowledge: { name: 'knowledge', description: 'Knowledge base', tables: ['knowledge_items', 'knowledge_categories', 'knowledge_links'], createdAt: new Date().toISOString() },
  memory: { name: 'memory', description: 'Agent memory storage', tables: ['memories', 'memory_embeddings', 'memory_index'], createdAt: new Date().toISOString() },
  playbooks: { name: 'playbooks', description: 'Editorial playbooks', tables: ['playbooks', 'playbook_steps', 'playbook_templates'], createdAt: new Date().toISOString() },
  business: { name: 'business', description: 'Business metrics', tables: ['business_metrics', 'revenue', 'costs'], createdAt: new Date().toISOString() },
  analytics: { name: 'analytics', description: 'Analytics data', tables: ['analytics_events', 'analytics_aggregates', 'analytics_reports'], createdAt: new Date().toISOString() },
  audit: { name: 'audit', description: 'Audit trail', tables: ['audit_logs', 'audit_changes', 'audit_trail'], createdAt: new Date().toISOString() },
  system: { name: 'system', description: 'System configuration', tables: ['system_config', 'system_flags', 'system_versions'], createdAt: new Date().toISOString() },
  security: { name: 'security', description: 'Security settings', tables: ['api_keys', 'permissions', 'roles'], createdAt: new Date().toISOString() },
  logs: { name: 'logs', description: 'Application logs', tables: ['app_logs', 'error_logs', 'access_logs'], createdAt: new Date().toISOString() },
  settings: { name: 'settings', description: 'User and system settings', tables: ['user_settings', 'org_settings', 'feature_flags'], createdAt: new Date().toISOString() },
  users: { name: 'users', description: 'User management', tables: ['users', 'user_profiles', 'user_sessions'], createdAt: new Date().toISOString() },
};

export function generateSchemaSQL(): string {
  const lines: string[] = [];
  for (const schema of DATABASE_SCHEMAS) {
    lines.push(`CREATE SCHEMA IF NOT EXISTS ${schema};`);
  }
  return lines.join('\n');
}
