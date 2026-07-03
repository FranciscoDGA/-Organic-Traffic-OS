-- ============================================================
-- ORGANIC TRAFFIC OS — SUPABASE STORAGE SECURITY POLICIES
-- ============================================================

-- Ensure RLS is active on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. Policy: Service Role full access
CREATE POLICY service_role_storage_access ON storage.objects
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2. Policy: Public read access to public buckets only
CREATE POLICY public_read_access ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id IN ('images', 'generated-images', 'workspace-assets'));

-- 3. Policy: Authenticated users read private documents matching their workspace metadata
-- Preparing skeleton for user token checks when workspace matches path prefix
CREATE POLICY authenticated_workspace_read ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    (bucket_id IN ('articles', 'drafts', 'reports', 'playbooks', 'exports', 'imports', 'videos', 'ebooks', 'datasets'))
    -- Ensures workspace_id is the first part of the folder path
    AND (substring(name from '^([^/]+)') = (auth.jwt() -> 'user_metadata' ->> 'workspace_id'))
  );

-- 4. Policy: Authenticated users insert/update/delete in their workspace folder
CREATE POLICY authenticated_workspace_modify ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    (bucket_id IN ('images', 'generated-images', 'workspace-assets', 'articles', 'drafts', 'reports', 'playbooks', 'exports', 'imports', 'videos', 'ebooks', 'datasets'))
    AND (substring(name from '^([^/]+)') = (auth.jwt() -> 'user_metadata' ->> 'workspace_id'))
  )
  WITH CHECK (
    (bucket_id IN ('images', 'generated-images', 'workspace-assets', 'articles', 'drafts', 'reports', 'playbooks', 'exports', 'imports', 'videos', 'ebooks', 'datasets'))
    AND (substring(name from '^([^/]+)') = (auth.jwt() -> 'user_metadata' ->> 'workspace_id'))
  );
