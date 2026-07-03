-- ============================================================
-- ORGANIC TRAFFIC OS — INITIAL SCHEMA MIGRATION (001)
-- ============================================================

-- 1. Create Schemas
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS workspaces;
CREATE SCHEMA IF NOT EXISTS missions;
CREATE SCHEMA IF NOT EXISTS agents;
CREATE SCHEMA IF NOT EXISTS runtime;
CREATE SCHEMA IF NOT EXISTS publisher;
CREATE SCHEMA IF NOT EXISTS campaigns;
CREATE SCHEMA IF NOT EXISTS knowledge;
CREATE SCHEMA IF NOT EXISTS memory;
CREATE SCHEMA IF NOT EXISTS playbooks;
CREATE SCHEMA IF NOT EXISTS business;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS events;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS security;
CREATE SCHEMA IF NOT EXISTS settings;

-- 2. Create Common Functions & Triggers
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Core Layer (Users, Roles, Permissions)
CREATE TABLE IF NOT EXISTS core.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS core.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS core.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS core.user_roles (
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES core.roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- 4. Workspaces Layer
CREATE TABLE IF NOT EXISTS workspaces.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'setup_pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS workspaces.workspace_settings (
  workspace_id UUID PRIMARY KEY REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS workspaces.workspace_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  niche TEXT,
  target_audience JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 5. Agents Layer
CREATE TABLE IF NOT EXISTS agents.agent_registry (
  agent_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  manifest JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS agents.agent_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT REFERENCES agents.agent_registry(agent_id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'idle',
  last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 6. Missions Layer
CREATE TABLE IF NOT EXISTS missions.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  objective TEXT NOT NULL,
  strategy TEXT,
  tasks JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS missions.mission_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID REFERENCES missions.missions(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 7. Campaigns Layer
CREATE TABLE IF NOT EXISTS campaigns.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS campaigns.campaign_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns.campaigns(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 8. Publisher Layer
CREATE TABLE IF NOT EXISTS publisher.publisher_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  content_id UUID,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS publisher.publishing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  content_id UUID,
  platform TEXT NOT NULL,
  status TEXT NOT NULL,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 9. Knowledge & Memory Layer
CREATE TABLE IF NOT EXISTS knowledge.knowledge_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  entity TEXT NOT NULL,
  relation TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS memory.memory_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 10. Playbooks Layer
CREATE TABLE IF NOT EXISTS playbooks.playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS playbooks.playbook_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_id UUID REFERENCES playbooks.playbooks(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  steps JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 11. Business & Analytics
CREATE TABLE IF NOT EXISTS business.business_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC(15,4) NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS analytics.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  correlation_id UUID,
  status TEXT DEFAULT 'logged',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 12. Event Store & Runtime
CREATE TABLE IF NOT EXISTS events.event_store (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  correlation_id UUID,
  payload JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS runtime.runtime_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS runtime.worker_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 13. Audit & Security
CREATE TABLE IF NOT EXISTS audit.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  actor TEXT NOT NULL,
  status TEXT DEFAULT 'logged',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS security.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS security.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  status TEXT DEFAULT 'logged',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 14. Settings Layer
CREATE TABLE IF NOT EXISTS settings.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces.workspaces(id) ON DELETE CASCADE,
  flag_key TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'disabled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS settings.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 15. Apply triggers for updated_at
DO $$
DECLARE
  t RECORD;
BEGIN
  FOR t IN 
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_schema IN (
      'core', 'workspaces', 'agents', 'missions', 'campaigns', 
      'publisher', 'knowledge', 'memory', 'playbooks', 'business', 
      'analytics', 'events', 'runtime', 'audit', 'security', 'settings'
    ) AND table_type = 'BASE TABLE' AND table_name NOT IN ('user_roles')
  LOOP
    EXECUTE format('
      CREATE OR REPLACE TRIGGER trg_set_updated_at_%I_%I
      BEFORE UPDATE ON %I.%I
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
      t.table_schema, t.table_name, t.table_schema, t.table_name
    );
  END LOOP;
END;
$$;

-- 16. Create Indexes
CREATE INDEX IF NOT EXISTS idx_workspaces_status ON workspaces.workspaces(status);
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON workspaces.workspaces(slug);

CREATE INDEX IF NOT EXISTS idx_workspace_settings_workspace_id ON workspaces.workspace_settings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_profiles_workspace_id ON workspaces.workspace_profiles(workspace_id);

CREATE INDEX IF NOT EXISTS idx_agent_sessions_agent_id ON agents.agent_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_workspace_id ON agents.agent_sessions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_status ON agents.agent_sessions(status);

CREATE INDEX IF NOT EXISTS idx_missions_workspace_id ON missions.missions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions.missions(status);
CREATE INDEX IF NOT EXISTS idx_mission_history_mission_id ON missions.mission_history(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_history_status ON missions.mission_history(status);

CREATE INDEX IF NOT EXISTS idx_campaigns_workspace_id ON campaigns.campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_tasks_campaign_id ON campaigns.campaign_tasks(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_tasks_status ON campaigns.campaign_tasks(status);

CREATE INDEX IF NOT EXISTS idx_publisher_queue_workspace_id ON publisher.publisher_queue(workspace_id);
CREATE INDEX IF NOT EXISTS idx_publisher_queue_status ON publisher.publisher_queue(status);
CREATE INDEX IF NOT EXISTS idx_publisher_queue_content_id ON publisher.publisher_queue(content_id);
CREATE INDEX IF NOT EXISTS idx_publishing_history_workspace_id ON publisher.publishing_history(workspace_id);
CREATE INDEX IF NOT EXISTS idx_publishing_history_content_id ON publisher.publishing_history(content_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_workspace_id ON knowledge.knowledge_nodes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_memory_records_workspace_id ON memory.memory_records(workspace_id);

CREATE INDEX IF NOT EXISTS idx_playbooks_workspace_id ON playbooks.playbooks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_playbook_versions_playbook_id ON playbooks.playbook_versions(playbook_id);

CREATE INDEX IF NOT EXISTS idx_business_metrics_workspace_id ON business.business_metrics(workspace_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_workspace_id ON analytics.analytics_events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_correlation_id ON analytics.analytics_events(correlation_id);

CREATE INDEX IF NOT EXISTS idx_event_store_workspace_id ON events.event_store(workspace_id);
CREATE INDEX IF NOT EXISTS idx_event_store_event_name ON events.event_store(event_name);
CREATE INDEX IF NOT EXISTS idx_event_store_correlation_id ON events.event_store(correlation_id);

CREATE INDEX IF NOT EXISTS idx_runtime_jobs_workspace_id ON runtime.runtime_jobs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_runtime_jobs_status ON runtime.runtime_jobs(status);
CREATE INDEX IF NOT EXISTS idx_worker_sessions_workspace_id ON runtime.worker_sessions(workspace_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_workspace_id ON audit.audit_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit.audit_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_api_keys_workspace_id ON security.api_keys(workspace_id);
CREATE INDEX IF NOT EXISTS idx_security_events_workspace_id ON security.security_events(workspace_id);

-- 17. Row Level Security Configuration
ALTER TABLE workspaces.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces.workspace_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces.workspace_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents.agent_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents.agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions.mission_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns.campaign_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE publisher.publisher_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE publisher.publishing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge.knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory.memory_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbooks.playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbooks.playbook_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE business.business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE events.event_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE runtime.runtime_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE runtime.worker_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE security.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.permissions ENABLE ROW LEVEL SECURITY;

-- 18. Service Role Master Access Policies
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN 
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_schema IN (
      'core', 'workspaces', 'agents', 'missions', 'campaigns', 
      'publisher', 'knowledge', 'memory', 'playbooks', 'business', 
      'analytics', 'events', 'runtime', 'audit', 'security', 'settings'
    ) AND table_type = 'BASE TABLE' AND table_name NOT IN ('user_roles')
  LOOP
    EXECUTE format('
      CREATE POLICY service_role_access ON %I.%I
      FOR ALL TO service_role USING (true) WITH CHECK (true);',
      rec.table_schema, rec.table_name
    );
  END LOOP;
END;
$$;

-- 19. Create Views
CREATE OR REPLACE VIEW core.system_health_view AS
SELECT 
  (SELECT COUNT(*) FROM runtime.worker_sessions WHERE status = 'active') AS active_workers,
  (SELECT COUNT(*) FROM runtime.runtime_jobs WHERE status = 'pending') AS pending_jobs,
  (SELECT COUNT(*) FROM security.security_events WHERE created_at > NOW() - INTERVAL '24 hours') AS recent_security_incidents,
  (SELECT COUNT(*) FROM audit.audit_logs WHERE created_at > NOW() - INTERVAL '24 hours') AS audit_actions_today;

CREATE OR REPLACE VIEW workspaces.workspace_overview_view AS
SELECT 
  w.id,
  w.name,
  w.slug,
  w.status,
  (SELECT COUNT(*) FROM missions.missions m WHERE m.workspace_id = w.id) AS total_missions,
  (SELECT COUNT(*) FROM publisher.publisher_queue pq WHERE pq.workspace_id = w.id AND pq.status = 'pending') AS pending_posts,
  (SELECT COUNT(*) FROM campaigns.campaigns c WHERE c.workspace_id = w.id) AS total_campaigns
FROM workspaces.workspaces w;

CREATE OR REPLACE VIEW missions.mission_overview_view AS
SELECT 
  m.id,
  m.workspace_id,
  w.name AS workspace_name,
  m.name AS mission_name,
  m.status,
  m.created_at,
  m.updated_at
FROM missions.missions m
LEFT JOIN workspaces.workspaces w ON m.workspace_id = w.id;

CREATE OR REPLACE VIEW agents.agent_status_view AS
SELECT 
  ar.agent_id,
  ar.name,
  ar.version,
  asess.workspace_id,
  asess.status AS current_status,
  asess.last_heartbeat
FROM agents.agent_registry ar
LEFT JOIN agents.agent_sessions asess ON ar.agent_id = asess.agent_id;

CREATE OR REPLACE VIEW publisher.publisher_queue_view AS
SELECT 
  pq.id,
  pq.workspace_id,
  w.name AS workspace_name,
  pq.title,
  pq.slug,
  pq.status,
  pq.created_at
FROM publisher.publisher_queue pq
LEFT JOIN workspaces.workspaces w ON pq.workspace_id = w.id;

CREATE OR REPLACE VIEW business.business_kpi_view AS
SELECT 
  bm.workspace_id,
  w.name AS workspace_name,
  bm.metric_name,
  bm.metric_value,
  bm.updated_at
FROM business.business_metrics bm
LEFT JOIN workspaces.workspaces w ON bm.workspace_id = w.id;
