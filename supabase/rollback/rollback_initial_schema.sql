-- ============================================================
-- ORGANIC TRAFFIC OS — ROLLBACK INITIAL SCHEMA (001)
-- ============================================================

-- 1. Drop Views
DROP VIEW IF EXISTS business.business_kpi_view CASCADE;
DROP VIEW IF EXISTS publisher.publisher_queue_view CASCADE;
DROP VIEW IF EXISTS agents.agent_status_view CASCADE;
DROP VIEW IF EXISTS missions.mission_overview_view CASCADE;
DROP VIEW IF EXISTS workspaces.workspace_overview_view CASCADE;
DROP VIEW IF EXISTS core.system_health_view CASCADE;

-- 2. Drop Triggers on all tables (Dynamically mapped in schema but safely dropped here)
-- Since dropping schemas/tables with CASCADE removes their triggers, we can safely proceed.

-- 3. Drop Tables
DROP TABLE IF EXISTS settings.system_settings CASCADE;
DROP TABLE IF EXISTS settings.feature_flags CASCADE;
DROP TABLE IF EXISTS security.security_events CASCADE;
DROP TABLE IF EXISTS security.api_keys CASCADE;
DROP TABLE IF EXISTS audit.audit_logs CASCADE;
DROP TABLE IF EXISTS runtime.worker_sessions CASCADE;
DROP TABLE IF EXISTS runtime.runtime_jobs CASCADE;
DROP TABLE IF EXISTS events.event_store CASCADE;
DROP TABLE IF EXISTS analytics.analytics_events CASCADE;
DROP TABLE IF EXISTS business.business_metrics CASCADE;
DROP TABLE IF EXISTS playbooks.playbook_versions CASCADE;
DROP TABLE IF EXISTS playbooks.playbooks CASCADE;
DROP TABLE IF EXISTS memory.memory_records CASCADE;
DROP TABLE IF EXISTS knowledge.knowledge_nodes CASCADE;
DROP TABLE IF EXISTS publisher.publishing_history CASCADE;
DROP TABLE IF EXISTS publisher.publisher_queue CASCADE;
DROP TABLE IF EXISTS campaigns.campaign_tasks CASCADE;
DROP TABLE IF EXISTS campaigns.campaigns CASCADE;
DROP TABLE IF EXISTS missions.mission_history CASCADE;
DROP TABLE IF EXISTS missions.missions CASCADE;
DROP TABLE IF EXISTS agents.agent_sessions CASCADE;
DROP TABLE IF EXISTS agents.agent_registry CASCADE;
DROP TABLE IF EXISTS workspaces.workspace_profiles CASCADE;
DROP TABLE IF EXISTS workspaces.workspace_settings CASCADE;
DROP TABLE IF EXISTS workspaces.workspaces CASCADE;
DROP TABLE IF EXISTS core.user_roles CASCADE;
DROP TABLE IF EXISTS core.permissions CASCADE;
DROP TABLE IF EXISTS core.roles CASCADE;
DROP TABLE IF EXISTS core.users CASCADE;

-- 4. Drop Functions
DROP FUNCTION IF EXISTS set_updated_at() CASCADE;

-- 5. Drop Schemas
DROP SCHEMA IF EXISTS settings CASCADE;
DROP SCHEMA IF EXISTS security CASCADE;
DROP SCHEMA IF EXISTS audit CASCADE;
DROP SCHEMA IF EXISTS runtime CASCADE;
DROP SCHEMA IF EXISTS events CASCADE;
DROP SCHEMA IF EXISTS analytics CASCADE;
DROP SCHEMA IF EXISTS business CASCADE;
DROP SCHEMA IF EXISTS playbooks CASCADE;
DROP SCHEMA IF EXISTS memory CASCADE;
DROP SCHEMA IF EXISTS knowledge CASCADE;
DROP SCHEMA IF EXISTS publisher CASCADE;
DROP SCHEMA IF EXISTS campaigns CASCADE;
DROP SCHEMA IF EXISTS missions CASCADE;
DROP SCHEMA IF EXISTS agents CASCADE;
DROP SCHEMA IF EXISTS workspaces CASCADE;
DROP SCHEMA IF EXISTS core CASCADE;
