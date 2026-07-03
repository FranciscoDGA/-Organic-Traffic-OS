-- ============================================================
-- ORGANIC TRAFFIC OS — MOCK SEED DATA FOR WORKSPACES
-- ============================================================

INSERT INTO workspaces.workspaces (id, name, slug, status, metadata)
VALUES
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'PassaCumaru', 'passacumaru', 'setup_pending', '{"focus": "Concursos e Editais"}'::jsonb),
  ('b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e', 'Qual o Seguro', 'qualoseguro', 'inactive', '{"focus": "Seguros e Finanças"}'::jsonb),
  ('c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'UtilPro Brasil', 'utilpro', 'inactive', '{"focus": "Utilidades Domésticas"}'::jsonb),
  ('d4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'Tabuometro', 'tabuometro', 'inactive', '{"focus": "Esportes e Lazer"}'::jsonb),
  ('e5f67a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', 'AI Agency OS', 'aiagency', 'setup_pending', '{"focus": "Inteligência Artificial"}'::jsonb)
ON CONFLICT (slug) DO UPDATE
SET 
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- Insert empty configurations in workspace settings
INSERT INTO workspaces.workspace_settings (workspace_id, status, settings)
VALUES
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'active', '{"auto_publish": false, "require_approval": true}'::jsonb),
  ('b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e', 'active', '{"auto_publish": false, "require_approval": true}'::jsonb),
  ('c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'active', '{"auto_publish": false, "require_approval": true}'::jsonb),
  ('d4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'active', '{"auto_publish": false, "require_approval": true}'::jsonb),
  ('e5f67a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', 'active', '{"auto_publish": false, "require_approval": true}'::jsonb)
ON CONFLICT (workspace_id) DO NOTHING;
