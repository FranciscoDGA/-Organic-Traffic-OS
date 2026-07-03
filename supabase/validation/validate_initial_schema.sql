-- ============================================================
-- ORGANIC TRAFFIC OS — SCHEMA VALIDATION SCRIPT
-- ============================================================

SELECT 
  -- 1. Validate Schemas
  (SELECT COUNT(*) = 16 FROM information_schema.schemata WHERE schema_name IN (
    'core', 'workspaces', 'missions', 'agents', 'runtime', 'publisher', 'campaigns',
    'knowledge', 'memory', 'playbooks', 'business', 'analytics', 'events', 'audit', 'security', 'settings'
  )) AS schemas_ok,

  -- 2. Validate Tables count (28 tables base)
  (SELECT COUNT(*) = 28 FROM information_schema.tables WHERE table_schema IN (
    'core', 'workspaces', 'missions', 'agents', 'runtime', 'publisher', 'campaigns',
    'knowledge', 'memory', 'playbooks', 'business', 'analytics', 'events', 'audit', 'security', 'settings'
  ) AND table_type = 'BASE TABLE') AS tables_count_ok,

  -- 3. Validate Views count (6 views)
  (SELECT COUNT(*) = 6 FROM information_schema.views WHERE table_schema IN (
    'core', 'workspaces', 'missions', 'agents', 'publisher', 'business'
  )) AS views_count_ok,

  -- 4. Validate RLS enabled
  (SELECT COUNT(*) = 28 FROM pg_tables WHERE schemaname IN (
    'core', 'workspaces', 'missions', 'agents', 'runtime', 'publisher', 'campaigns',
    'knowledge', 'memory', 'playbooks', 'business', 'analytics', 'events', 'audit', 'security', 'settings'
  ) AND rowsecurity = true) AS rls_enabled_ok,

  -- 5. Validate Triggers count (Triggers on BASE TABLES for updated_at)
  (SELECT COUNT(*) = 27 FROM information_schema.triggers WHERE trigger_name LIKE 'trg_set_updated_at_%') AS triggers_ok,

  -- 6. Validate Workspaces Seed (If executed)
  (SELECT COUNT(*) >= 5 FROM workspaces.workspaces) AS workspaces_seeded_ok;
