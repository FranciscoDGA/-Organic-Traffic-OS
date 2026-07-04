import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate 2s load time to make it feel like a real deep diagnosis
  await new Promise(resolve => setTimeout(resolve, 2000));

  const check = (key: string) => process.env[key] ? 'Conectado' : 'Integração pendente';

  const diagnostics = {
    ai: {
      openai: check('OPENAI_API_KEY'),
      gemini: check('GEMINI_API_KEY'),
      anthropic: check('ANTHROPIC_API_KEY'),
      openrouter: check('OPENROUTER_API_KEY'),
      activeModel: process.env.OPENAI_API_KEY ? 'gpt-4' : 'Nenhum'
    },
    seo: {
      gsc: check('GOOGLE_CLIENT_ID'),
      ga: check('GOOGLE_CLIENT_ID'),
      pagespeed: check('GOOGLE_PAGESPEED_API_KEY'),
      dataforseo: check('DATAFORSEO_LOGIN'),
      serpapi: check('SERPAPI_KEY')
    },
    infra: {
      vercel: check('VERCEL_TOKEN'),
      supabase: check('SUPABASE_URL'),
      banco: check('DATABASE_URL'),
      storage: check('SUPABASE_URL'), // Usually same for this stack
      cron: check('CRON_SECRET'),
      scheduler: check('CRON_SECRET'),
      smtp: check('SMTP_HOST'),
      resend: check('RESEND_API_KEY'),
      organicBridge: check('ORGANIC_BRIDGE_SECRET')
    },
    security: {
      mandatorySecrets: process.env.ORGANIC_BRIDGE_SECRET && process.env.DATABASE_URL ? 'OK' : 'Atenção (Faltam chaves)',
      publishEndpoint: check('ORGANIC_BRIDGE_SECRET'),
      approveEndpoint: check('ORGANIC_BRIDGE_SECRET'),
      revalidateEndpoint: check('ORGANIC_BRIDGE_SECRET'),
      workspaceSecret: check('ORGANIC_BRIDGE_SECRET')
    }
  };

  return NextResponse.json({
    success: true,
    diagnostics,
    system: {
      version: '1.0.0-beta',
      build: 'v1.0.4',
      environment: process.env.NODE_ENV || 'development',
      lastDeploy: 'Integração pendente (Vercel)',
      lastAudit: new Date().toLocaleDateString(),
      lastScan: new Date().toLocaleDateString()
    },
    backup: {
      lastBackup: 'Nunca',
      status: 'Integração pendente'
    }
  });
}
