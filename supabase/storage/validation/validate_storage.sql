-- ============================================================
-- ORGANIC TRAFFIC OS — STORAGE VALIDATION SCRIPT
-- ============================================================

SELECT 
  -- 1. Validate total buckets created (15 buckets)
  (SELECT COUNT(*) = 15 FROM storage.buckets WHERE id IN (
    'images', 'generated-images', 'workspace-assets', 'articles', 'drafts', 'reports',
    'playbooks', 'logs', 'backups', 'exports', 'imports', 'temporary', 'videos', 'ebooks', 'datasets'
  )) AS buckets_ok,

  -- 2. Validate Public Buckets count (3 public buckets)
  (SELECT COUNT(*) = 3 FROM storage.buckets WHERE id IN ('images', 'generated-images', 'workspace-assets') AND public = true) AS public_buckets_ok,

  -- 3. Validate Private Buckets count (12 private buckets)
  (SELECT COUNT(*) = 12 FROM storage.buckets WHERE id IN (
    'articles', 'drafts', 'reports', 'playbooks', 'logs', 'backups', 'exports', 'imports', 'temporary', 'videos', 'ebooks', 'datasets'
  ) AND public = false) AS private_buckets_ok,

  -- 4. Validate Policies enabled on storage.objects
  (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'objects') AS storage_rls_ok;
