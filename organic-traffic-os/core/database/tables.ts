export interface TableDefinition {
  name: string;
  schema: string;
  columns: ColumnDefinition[];
  indexes: string[];
  rls: boolean;
  audit: boolean;
}

export interface ColumnDefinition {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
  foreignKey?: string;
}

const BASE_COLUMNS: ColumnDefinition[] = [
  { name: 'id', type: 'uuid', nullable: false, default: 'gen_random_uuid()' },
  { name: 'workspace_id', type: 'uuid', nullable: true, foreignKey: 'workspaces.workspaces.id' },
  { name: 'created_at', type: 'timestamptz', nullable: false, default: 'now()' },
  { name: 'updated_at', type: 'timestamptz', nullable: false, default: 'now()' },
  { name: 'created_by', type: 'uuid', nullable: true, foreignKey: 'users.users.id' },
  { name: 'version', type: 'integer', nullable: false, default: '1' },
  { name: 'status', type: 'text', nullable: false, default: "'active'" },
];

function table(name: string, schema: string, extra: ColumnDefinition[], indexes: string[], rls = true, audit = true): TableDefinition {
  return { name, schema, columns: [...BASE_COLUMNS, ...extra], indexes, rls, audit };
}

export const TABLES: TableDefinition[] = [
  table('workspaces', 'workspaces', [
    { name: 'name', type: 'text', nullable: false },
    { name: 'slug', type: 'text', nullable: false },
    { name: 'domain', type: 'text', nullable: true },
    { name: 'description', type: 'text', nullable: true },
  ], ['slug', 'status', 'created_at'], true, true),

  table('workspace_settings', 'workspaces', [
    { name: 'key', type: 'text', nullable: false },
    { name: 'value', type: 'jsonb', nullable: true },
  ], ['workspace_id', 'key'], true, false),

  table('workspace_members', 'workspaces', [
    { name: 'user_id', type: 'uuid', nullable: false, foreignKey: 'users.users.id' },
    { name: 'role', type: 'text', nullable: false, default: "'member'" },
  ], ['workspace_id', 'user_id'], true, true),

  table('missions', 'missions', [
    { name: 'name', type: 'text', nullable: false },
    { name: 'type', type: 'text', nullable: false },
    { name: 'priority', type: 'integer', nullable: false, default: '5' },
    { name: 'config', type: 'jsonb', nullable: true },
    { name: 'result', type: 'jsonb', nullable: true },
    { name: 'started_at', type: 'timestamptz', nullable: true },
    { name: 'completed_at', type: 'timestamptz', nullable: true },
  ], ['workspace_id', 'status', 'type', 'created_at'], true, true),

  table('mission_history', 'missions', [
    { name: 'mission_id', type: 'uuid', nullable: false, foreignKey: 'missions.missions.id' },
    { name: 'action', type: 'text', nullable: false },
    { name: 'data', type: 'jsonb', nullable: true },
  ], ['mission_id', 'created_at'], true, true),

  table('mission_steps', 'missions', [
    { name: 'mission_id', type: 'uuid', nullable: false, foreignKey: 'missions.missions.id' },
    { name: 'step_name', type: 'text', nullable: false },
    { name: 'step_status', type: 'text', nullable: false, default: "'pending'" },
    { name: 'result', type: 'jsonb', nullable: true },
  ], ['mission_id'], true, true),

  table('agent_registry', 'agents', [
    { name: 'name', type: 'text', nullable: false },
    { name: 'type', type: 'text', nullable: false },
    { name: 'config', type: 'jsonb', nullable: true },
    { name: 'capabilities', type: 'jsonb', nullable: true },
  ], ['workspace_id', 'type', 'status'], true, true),

  table('agent_sessions', 'agents', [
    { name: 'agent_id', type: 'uuid', nullable: false, foreignKey: 'agents.agent_registry.id' },
    { name: 'mission_id', type: 'uuid', nullable: true, foreignKey: 'missions.missions.id' },
    { name: 'input', type: 'jsonb', nullable: true },
    { name: 'output', type: 'jsonb', nullable: true },
    { name: 'started_at', type: 'timestamptz', nullable: false, default: 'now()' },
    { name: 'ended_at', type: 'timestamptz', nullable: true },
  ], ['agent_id', 'mission_id', 'started_at'], true, true),

  table('campaigns', 'campaigns', [
    { name: 'name', type: 'text', nullable: false },
    { name: 'type', type: 'text', nullable: false },
    { name: 'budget', type: 'numeric', nullable: true },
    { name: 'start_date', type: 'date', nullable: true },
    { name: 'end_date', type: 'date', nullable: true },
    { name: 'config', type: 'jsonb', nullable: true },
  ], ['workspace_id', 'status', 'type', 'created_at'], true, true),

  table('campaign_tasks', 'campaigns', [
    { name: 'campaign_id', type: 'uuid', nullable: false, foreignKey: 'campaigns.campaigns.id' },
    { name: 'name', type: 'text', nullable: false },
    { name: 'type', type: 'text', nullable: false },
    { name: 'status', type: 'text', nullable: false, default: "'pending'" },
    { name: 'result', type: 'jsonb', nullable: true },
  ], ['campaign_id', 'status'], true, true),

  table('content_drafts', 'publisher', [
    { name: 'title', type: 'text', nullable: false },
    { name: 'slug', type: 'text', nullable: false },
    { name: 'body', type: 'text', nullable: true },
    { name: 'format', type: 'text', nullable: false, default: "'markdown'" },
    { name: 'metadata', type: 'jsonb', nullable: true },
    { name: 'published_at', type: 'timestamptz', nullable: true },
  ], ['workspace_id', 'status', 'slug', 'created_at'], true, true),

  table('publisher_queue', 'publisher', [
    { name: 'content_id', type: 'uuid', nullable: false, foreignKey: 'publisher.content_drafts.id' },
    { name: 'action', type: 'text', nullable: false },
    { name: 'scheduled_at', type: 'timestamptz', nullable: true },
    { name: 'processed_at', type: 'timestamptz', nullable: true },
    { name: 'error', type: 'text', nullable: true },
  ], ['workspace_id', 'status', 'scheduled_at'], true, true),

  table('publishing_history', 'publisher', [
    { name: 'content_id', type: 'uuid', nullable: false },
    { name: 'action', type: 'text', nullable: false },
    { name: 'target', type: 'text', nullable: true },
    { name: 'result', type: 'jsonb', nullable: true },
  ], ['content_id', 'created_at'], true, true),

  table('knowledge_nodes', 'knowledge', [
    { name: 'title', type: 'text', nullable: false },
    { name: 'type', type: 'text', nullable: false },
    { name: 'content', type: 'text', nullable: true },
    { name: 'embedding', type: 'vector', nullable: true },
    { name: 'metadata', type: 'jsonb', nullable: true },
  ], ['workspace_id', 'type', 'created_at'], true, true),

  table('memory_records', 'memory', [
    { name: 'agent_id', type: 'uuid', nullable: false, foreignKey: 'agents.agent_registry.id' },
    { name: 'content', type: 'text', nullable: false },
    { name: 'embedding', type: 'vector', nullable: true },
    { name: 'metadata', type: 'jsonb', nullable: true },
    { name: 'expires_at', type: 'timestamptz', nullable: true },
  ], ['agent_id', 'workspace_id', 'created_at'], true, true),

  table('playbooks', 'playbooks', [
    { name: 'name', type: 'text', nullable: false },
    { name: 'description', type: 'text', nullable: true },
    { name: 'content', type: 'jsonb', nullable: true },
  ], ['workspace_id', 'status', 'created_at'], true, true),

  table('playbook_versions', 'playbooks', [
    { name: 'playbook_id', type: 'uuid', nullable: false, foreignKey: 'playbooks.playbooks.id' },
    { name: 'content', type: 'jsonb', nullable: true },
    { name: 'change_notes', type: 'text', nullable: true },
  ], ['playbook_id', 'version'], true, true),

  table('business_metrics', 'business', [
    { name: 'metric_name', type: 'text', nullable: false },
    { name: 'metric_value', type: 'numeric', nullable: false },
    { name: 'metric_type', type: 'text', nullable: false },
    { name: 'period', type: 'text', nullable: true },
    { name: 'metadata', type: 'jsonb', nullable: true },
  ], ['workspace_id', 'metric_name', 'created_at'], false, false),

  table('analytics_events', 'analytics', [
    { name: 'event_type', type: 'text', nullable: false },
    { name: 'entity_type', type: 'text', nullable: true },
    { name: 'entity_id', type: 'uuid', nullable: true },
    { name: 'data', type: 'jsonb', nullable: true },
  ], ['workspace_id', 'event_type', 'created_at'], true, false),

  table('audit_logs', 'audit', [
    { name: 'table_name', type: 'text', nullable: false },
    { name: 'record_id', type: 'uuid', nullable: true },
    { name: 'action', type: 'text', nullable: false },
    { name: 'old_data', type: 'jsonb', nullable: true },
    { name: 'new_data', type: 'jsonb', nullable: true },
    { name: 'ip_address', type: 'inet', nullable: true },
    { name: 'user_agent', type: 'text', nullable: true },
  ], ['table_name', 'record_id', 'action', 'created_at', 'workspace_id'], false, false),

  table('api_keys', 'security', [
    { name: 'name', type: 'text', nullable: false },
    { name: 'key_hash', type: 'text', nullable: false },
    { name: 'permissions', type: 'jsonb', nullable: true },
    { name: 'expires_at', type: 'timestamptz', nullable: true },
    { name: 'last_used_at', type: 'timestamptz', nullable: true },
  ], ['workspace_id', 'status'], false, true),

  table('users', 'users', [
    { name: 'email', type: 'text', nullable: false },
    { name: 'name', type: 'text', nullable: true },
    { name: 'role', type: 'text', nullable: false, default: "'user'" },
    { name: 'avatar_url', type: 'text', nullable: true },
  ], ['email', 'status', 'created_at'], true, true),

  table('user_settings', 'settings', [
    { name: 'user_id', type: 'uuid', nullable: false, foreignKey: 'users.users.id' },
    { name: 'key', type: 'text', nullable: false },
    { name: 'value', type: 'jsonb', nullable: true },
  ], ['user_id', 'key'], true, false),

  table('event_store', 'events', [
    { name: 'event_type', type: 'text', nullable: false },
    { name: 'aggregate_id', type: 'uuid', nullable: true },
    { name: 'payload', type: 'jsonb', nullable: true },
    { name: 'metadata', type: 'jsonb', nullable: true },
  ], ['event_type', 'aggregate_id', 'created_at'], false, false),

  table('runtime_jobs', 'runtime', [
    { name: 'job_type', type: 'text', nullable: false },
    { name: 'payload', type: 'jsonb', nullable: true },
    { name: 'result', type: 'jsonb', nullable: true },
    { name: 'started_at', type: 'timestamptz', nullable: true },
    { name: 'completed_at', type: 'timestamptz', nullable: true },
  ], ['workspace_id', 'status', 'job_type', 'created_at'], false, false),

  table('system_settings', 'system', [
    { name: 'key', type: 'text', nullable: false },
    { name: 'value', type: 'jsonb', nullable: true },
    { name: 'description', type: 'text', nullable: true },
  ], ['key'], false, true),
];

export function getTablesBySchema(schema: string): TableDefinition[] {
  return TABLES.filter(t => t.schema === schema);
}

export function getAllTables(): TableDefinition[] {
  return [...TABLES];
}

export function getTotalTableCount(): number {
  return TABLES.length;
}
