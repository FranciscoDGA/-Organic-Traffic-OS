$targetDir = $args[0]
$workspaceId = $args[1]
$autoPublish = $args[2]

if (-not (Test-Path $targetDir)) {
    Write-Host "Directory not found: $targetDir"
    exit 1
}

$apiDir = Join-Path $targetDir "api\organic-publisher"
if (-not (Test-Path $apiDir)) {
    New-Item -ItemType Directory -Force -Path $apiDir | Out-Null
}

$isTabuometro = if ($workspaceId -eq 'tabuometro') { 'true' } else { 'false' }
$isUtilpro = if ($workspaceId -eq 'utilpro') { 'true' } else { 'false' }
$isAiagency = if ($workspaceId -eq 'aiagency') { 'true' } else { 'false' }

$configContent = @"
export const organicConfig = {
  workspace_id: '$workspaceId',
  publisher_enabled: true,
  auto_publish: $autoPublish,
  editorial_mode: $isTabuometro,
  affiliate_mode: $isUtilpro,
  authority_mode: $isAiagency
};
"@
Set-Content -Path (Join-Path $targetDir "organic.config.ts") -Value $configContent

$supabaseContent = @"
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
"@
Set-Content -Path (Join-Path $apiDir "supabase.ts") -Value $supabaseContent

$publishContent = @"
import { supabase } from './supabase';
import { organicConfig } from '../organic.config';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const expectedSecret = process.env[`${organicConfig.workspace_id.toUpperCase()}_PUBLISH_SECRET`] || process.env.ORGANIC_PUBLISH_SECRET;
  if (!expectedSecret || req.headers['x-organic-secret'] !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = req.body;
    payload.status = organicConfig.auto_publish ? 'published' : 'draft';
    
    const { data, error } = await supabase
      .from('organic_drafts')
      .upsert([{
        workspace_id: payload.workspace_id,
        content_id: payload.content_id,
        title: payload.title,
        slug: payload.slug,
        payload: payload,
        status: payload.status
      }])
      .select();

    if (error) throw error;
    
    // Log
    await supabase.from('organic_logs').insert([{
      workspace_id: payload.workspace_id,
      content_id: payload.content_id,
      action: 'publish_received',
      result: 'success',
      message: `Received and saved as \${payload.status}`
    }]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
"@
Set-Content -Path (Join-Path $apiDir "publish.ts") -Value $publishContent

$approveContent = @"
import { supabase } from './supabase';
import { organicConfig } from '../organic.config';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { content_id } = req.body;
    const { data, error } = await supabase
      .from('organic_drafts')
      .update({ status: 'published' })
      .match({ workspace_id: organicConfig.workspace_id, content_id })
      .select();

    if (error) throw error;

    await supabase.from('organic_logs').insert([{
      workspace_id: organicConfig.workspace_id,
      content_id,
      action: 'approved',
      result: 'success',
      message: 'Draft approved and published'
    }]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
"@
Set-Content -Path (Join-Path $apiDir "approve.ts") -Value $approveContent

Write-Host "Injected Organic Bridge into $targetDir for $workspaceId"
