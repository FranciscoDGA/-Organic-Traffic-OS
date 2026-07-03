export const SCHEMAS = [
  'core', 'system', 'runtime', 'workspaces', 'missions', 'agents',
  'campaigns', 'publisher', 'knowledge', 'memory', 'playbooks',
  'business', 'analytics', 'audit', 'security', 'users', 'settings',
  'files', 'events',
] as const;

export type SchemaName = typeof SCHEMAS[number];

export interface SchemaConfig {
  name: SchemaName;
  description: string;
  tables: string[];
  auditEnabled: boolean;
  rlsEnabled: boolean;
}

export const SCHEMA_CONFIGS: Record<SchemaName, SchemaConfig> = {
  core: { name: 'core', description: 'Core system tables', tables: ['organizations', 'tenants', 'features', 'system_config'], auditEnabled: false, rlsEnabled: false },
  system: { name: 'system', description: 'System configuration and settings', tables: ['system_settings', 'feature_flags', 'system_versions'], auditEnabled: true, rlsEnabled: false },
  runtime: { name: 'runtime', description: 'Runtime engine state', tables: ['runtime_jobs', 'worker_sessions', 'runtime_heartbeats'], auditEnabled: false, rlsEnabled: false },
  workspaces: { name: 'workspaces', description: 'Multi-tenant workspaces', tables: ['workspaces', 'workspace_settings', 'workspace_members'], auditEnabled: true, rlsEnabled: true },
  missions: { name: 'missions', description: 'Mission and campaign tracking', tables: ['missions', 'mission_history', 'mission_steps'], auditEnabled: true, rlsEnabled: true },
  agents: { name: 'agents', description: 'AI Agent definitions and sessions', tables: ['agent_registry', 'agent_sessions', 'agent_states'], auditEnabled: true, rlsEnabled: true },
  campaigns: { name: 'campaigns', description: 'Marketing campaigns', tables: ['campaigns', 'campaign_tasks', 'campaign_metrics'], auditEnabled: true, rlsEnabled: true },
  publisher: { name: 'publisher', description: 'Content publishing pipeline', tables: ['publisher_queue', 'publishing_history', 'content_drafts'], auditEnabled: true, rlsEnabled: true },
  knowledge: { name: 'knowledge', description: 'Knowledge base', tables: ['knowledge_nodes', 'knowledge_edges', 'knowledge_categories'], auditEnabled: false, rlsEnabled: true },
  memory: { name: 'memory', description: 'Agent memory storage', tables: ['memory_records', 'memory_embeddings', 'memory_index'], auditEnabled: false, rlsEnabled: true },
  playbooks: { name: 'playbooks', description: 'Editorial playbooks', tables: ['playbooks', 'playbook_versions', 'playbook_templates'], auditEnabled: true, rlsEnabled: true },
  business: { name: 'business', description: 'Business metrics', tables: ['business_metrics', 'revenue_records', 'cost_records'], auditEnabled: false, rlsEnabled: false },
  analytics: { name: 'analytics', description: 'Analytics data', tables: ['analytics_events', 'analytics_aggregates', 'analytics_reports'], auditEnabled: false, rlsEnabled: true },
  audit: { name: 'audit', description: 'Audit trail', tables: ['audit_logs', 'audit_changes', 'audit_trail'], auditEnabled: false, rlsEnabled: false },
  security: { name: 'security', description: 'Security settings', tables: ['api_keys', 'security_events', 'rate_limits'], auditEnabled: true, rlsEnabled: false },
  users: { name: 'users', description: 'User management', tables: ['users', 'user_profiles', 'user_sessions'], auditEnabled: true, rlsEnabled: true },
  settings: { name: 'settings', description: 'User and org settings', tables: ['user_settings', 'org_settings', 'workspace_preferences'], auditEnabled: false, rlsEnabled: true },
  files: { name: 'files', description: 'File management', tables: ['file_uploads', 'file_metadata', 'file_versions'], auditEnabled: false, rlsEnabled: true },
  events: { name: 'events', description: 'Event sourcing', tables: ['event_store', 'event_subscriptions', 'event_projections'], auditEnabled: false, rlsEnabled: false },
};

export function getSchemas(): SchemaConfig[] {
  return Object.values(SCHEMA_CONFIGS);
}

export function getSchema(name: SchemaName): SchemaConfig | undefined {
  return SCHEMA_CONFIGS[name];
}

export function generateSchemaSQL(): string {
  return SCHEMAS.map(s => `CREATE SCHEMA IF NOT EXISTS ${s};`).join('\n');
}
