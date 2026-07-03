-- ============================================================
-- ORGANIC TRAFFIC OS — SUPABASE STORAGE BUCKETS PROVISIONING
-- ============================================================

-- 1. Insert Buckets into storage.buckets table
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  -- Public Buckets
  ('images', 'images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']),
  ('generated-images', 'generated-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('workspace-assets', 'workspace-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/json']),

  -- Private Buckets
  ('articles', 'articles', false, 1048576, ARRAY['text/markdown', 'text/html', 'application/json']),
  ('drafts', 'drafts', false, 1048576, ARRAY['text/markdown', 'text/html', 'application/json', 'application/pdf']),
  ('reports', 'reports', false, 5242880, ARRAY['application/json', 'application/pdf', 'text/markdown', 'text/plain']),
  ('playbooks', 'playbooks', false, 2097152, ARRAY['application/json', 'text/markdown']),
  ('logs', 'logs', false, 10485760, ARRAY['text/plain', 'application/json']),
  ('backups', 'backups', false, 104857600, ARRAY['application/zip', 'application/sql', 'application/json']),
  ('exports', 'exports', false, 52428800, ARRAY['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json']),
  ('imports', 'imports', false, 52428800, ARRAY['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json']),
  ('temporary', 'temporary', false, 10485760, NULL), -- Allows any mime type temporarily
  ('videos', 'videos', false, 104857600, ARRAY['video/mp4', 'video/webm']),
  ('ebooks', 'ebooks', false, 20971520, ARRAY['application/pdf', 'application/epub+zip']),
  ('datasets', 'datasets', false, 52428800, ARRAY['application/json', 'text/csv', 'application/octet-stream'])
ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
