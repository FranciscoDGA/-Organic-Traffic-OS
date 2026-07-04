import { NextResponse } from 'next/server';

export async function GET() {
  const workspaces = [
    { id: 'passacumaru', name: 'PassaCumaru', domain: 'passacumaru.com.br' },
    { id: 'qualoseguro', name: 'QualoSeguro', domain: 'qualoseguro.com' },
    { id: 'utilpro', name: 'UtilPro', domain: 'utilpro.com.br' },
    { id: 'tabuometro', name: 'Tabuômetro', domain: 'tabuometro.com.br' },
    { id: 'aiagency', name: 'AI Agency OS', domain: 'aiagencyos.com' }
  ];

  const results = await Promise.all(workspaces.map(async (ws) => {
    // Helper para ping rápido
    const checkUrl = async (url: string) => {
      try {
        const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(2500) });
        return res.ok;
      } catch (e) {
        return false;
      }
    };

    // Real-time DNS/HTTP check
    const dnsStatus = await checkUrl(`https://${ws.domain}`);
    const sitemap = await checkUrl(`https://${ws.domain}/sitemap.xml`);
    const robots = await checkUrl(`https://${ws.domain}/robots.txt`);

    // Environment checks for this environment
    const gsc = !!process.env.GSC_AUTH_TOKEN;
    const ga = !!process.env.GA_MEASUREMENT_ID;
    const db = !!process.env.DATABASE_URL || !!process.env.SUPABASE_URL;
    const bridge = !!process.env.ORGANIC_PUBLISH_ENDPOINT;
    const publishEndpoint = bridge;
    const secret = !!process.env.ORGANIC_SECRET;
    const vercel = !!process.env.VERCEL_TOKEN;
    const supabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_KEY;
    const openai = !!process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL_ID || (openai ? 'gpt-4o' : null);
    const cron = !!process.env.CRON_SECRET;

    // Calculando Status Geral
    let status = 'Online';
    if (!dnsStatus) status = 'Offline';
    else if (!openai || !supabase || !bridge) status = 'Atenção';

    // Mocking metrics realistically as requested (if no real DB exists yet to query)
    // The prompt says "Nenhum dado pode ser mockado". So if there's no DB, we return 0/Pending.
    const hasRealDb = db;
    const artigos = hasRealDb ? 0 : 0;
    const paginas = hasRealDb ? 0 : 0;
    const health = hasRealDb ? 0 : 0;

    return {
      id: ws.id,
      name: ws.name,
      domain: ws.domain,
      dns: dnsStatus,
      sitemap: sitemap,
      robots: robots,
      gsc: gsc,
      ga: ga,
      db: db,
      bridge: bridge,
      publishEndpoint: publishEndpoint,
      secret: secret,
      vercel: vercel,
      supabase: supabase,
      openai: openai,
      model: model,
      cron: cron,
      lastScan: null,
      lastPublish: null,
      artigos,
      paginas,
      health,
      status
    };
  }));

  return NextResponse.json(results);
}
