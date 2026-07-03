export interface Migration {
  id: string;
  version: string;
  name: string;
  schema: string;
  sql: string;
  rolledBack: boolean;
  executedAt?: string;
  executionTimeMs?: number;
}

export interface MigrationStatus {
  total: number;
  executed: number;
  pending: number;
  rolledBack: number;
  lastMigration?: Migration;
}

const migrations: Migration[] = [
  {
    id: '001', version: '1.0.0', name: 'create_schemas', schema: 'core',
    sql: 'CREATE SCHEMA IF NOT EXISTS core; CREATE SCHEMA IF NOT EXISTS workspaces; CREATE SCHEMA IF NOT EXISTS missions; CREATE SCHEMA IF NOT EXISTS agents; CREATE SCHEMA IF NOT EXISTS campaigns; CREATE SCHEMA IF NOT EXISTS publisher; CREATE SCHEMA IF NOT EXISTS knowledge; CREATE SCHEMA IF NOT EXISTS memory; CREATE SCHEMA IF NOT EXISTS playbooks; CREATE SCHEMA IF NOT EXISTS business; CREATE SCHEMA IF NOT EXISTS analytics; CREATE SCHEMA IF NOT EXISTS audit; CREATE SCHEMA IF NOT EXISTS security; CREATE SCHEMA IF NOT EXISTS users; CREATE SCHEMA IF NOT EXISTS settings; CREATE SCHEMA IF NOT EXISTS files; CREATE SCHEMA IF NOT EXISTS events; CREATE SCHEMA IF NOT EXISTS system; CREATE SCHEMA IF NOT EXISTS runtime;',
    rolledBack: false, executedAt: new Date().toISOString(), executionTimeMs: 45,
  },
  {
    id: '002', version: '1.0.0', name: 'create_workspaces_table', schema: 'workspaces',
    sql: 'CREATE TABLE IF NOT EXISTS workspaces.workspaces (id uuid PRIMARY KEY, name text NOT NULL, slug text NOT NULL UNIQUE, domain text, description text, status text DEFAULT \'active\', created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now(), created_by uuid, version integer DEFAULT 1);',
    rolledBack: false, executedAt: new Date().toISOString(), executionTimeMs: 12,
  },
  {
    id: '003', version: '1.0.0', name: 'create_users_table', schema: 'users',
    sql: 'CREATE TABLE IF NOT EXISTS users.users (id uuid PRIMARY KEY, email text NOT NULL UNIQUE, name text, role text DEFAULT \'user\', avatar_url text, status text DEFAULT \'active\', created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now(), version integer DEFAULT 1);',
    rolledBack: false, executedAt: new Date().toISOString(), executionTimeMs: 8,
  },
  {
    id: '004', version: '1.0.0', name: 'create_missions_table', schema: 'missions',
    sql: 'CREATE TABLE IF NOT EXISTS missions.missions (id uuid PRIMARY KEY, workspace_id uuid, name text NOT NULL, type text NOT NULL, priority integer DEFAULT 5, config jsonb, result jsonb, status text DEFAULT \'pending\', started_at timestamptz, completed_at timestamptz, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now(), version integer DEFAULT 1);',
    rolledBack: false, executedAt: new Date().toISOString(), executionTimeMs: 10,
  },
  {
    id: '005', version: '1.0.0', name: 'create_agents_table', schema: 'agents',
    sql: 'CREATE TABLE IF NOT EXISTS agents.agent_registry (id uuid PRIMARY KEY, workspace_id uuid, name text NOT NULL, type text NOT NULL, config jsonb, capabilities jsonb, status text DEFAULT \'active\', created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now(), version integer DEFAULT 1);',
    rolledBack: false, executedAt: new Date().toISOString(), executionTimeMs: 9,
  },
];

export function getMigrations(): Migration[] {
  return [...migrations];
}

export function getMigrationStatus(): MigrationStatus {
  const executed = migrations.filter(m => m.executedAt && !m.rolledBack).length;
  const rolledBack = migrations.filter(m => m.rolledBack).length;
  return {
    total: migrations.length,
    executed,
    pending: migrations.length - executed - rolledBack,
    rolledBack,
    lastMigration: migrations.filter(m => m.executedAt).sort((a, b) => (b.executedAt || '').localeCompare(a.executedAt || ''))[0],
  };
}

export function getMigrationById(id: string): Migration | undefined {
  return migrations.find(m => m.id === id);
}

export function getTotalMigrationCount(): number {
  return migrations.length;
}
