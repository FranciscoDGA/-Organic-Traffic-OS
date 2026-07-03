import { NextRequest, NextResponse } from 'next/server';
import { getGscService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, code, client_id, client_secret, redirect_uri, siteUrl, startDate, endDate, dimension } = body;

    const service = getGscService();

    if (action === 'initialize' || (!action && client_id)) {
      const config = {
        client_id: client_id || process.env.GOOGLE_CLIENT_ID || '',
        client_secret: client_secret || process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: redirect_uri || process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/organic-os/connectors/google-search-console/callback',
      };
      const result = await service.connect(config);
      if (!result.success) return NextResponse.json(result, { status: 400 });

      const authUrl = service.getAuthorizationUrl();
      return NextResponse.json({ success: true, auth_url: authUrl });
    }

    if (action === 'callback' && code) {
      const result = await service.handleOAuthCallback(code);
      return NextResponse.json(result);
    }

    if (action === 'sync' && siteUrl) {
      const result = await service.sync(siteUrl);
      return NextResponse.json(result);
    }

    if (action === 'fetchQueries' && siteUrl && startDate && endDate) {
      const result = await service.fetchQueries(siteUrl, startDate, endDate);
      return NextResponse.json(result);
    }

    if (action === 'fetchPages' && siteUrl && startDate && endDate) {
      const result = await service.fetchPages(siteUrl, startDate, endDate);
      return NextResponse.json(result);
    }

    if (action === 'fetchMetrics' && siteUrl && startDate && endDate) {
      const result = await service.fetchMetrics(siteUrl, startDate, endDate, dimension || 'query');
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: 'Ação inválida ou parâmetros ausentes' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
