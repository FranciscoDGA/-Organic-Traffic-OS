import { NextRequest, NextResponse } from 'next/server';
import { getGa4Service } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, code, client_id, client_secret, redirect_uri, propertyId, startDate, endDate } = body;

    const service = getGa4Service();

    if (action === 'initialize' || (!action && client_id)) {
      const config = {
        client_id: client_id || process.env.GA4_CLIENT_ID || '',
        client_secret: client_secret || process.env.GA4_CLIENT_SECRET || '',
        redirect_uri: redirect_uri || process.env.GA4_REDIRECT_URI || 'http://localhost:3000/api/organic-os/connectors/google-analytics-4/callback',
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

    if (action === 'disconnect') {
      const result = await service.disconnect();
      return NextResponse.json(result);
    }

    if (action === 'sync' && propertyId) {
      const result = await service.sync(propertyId);
      return NextResponse.json(result);
    }

    if (action === 'listProperties') {
      const result = await service.listProperties();
      return NextResponse.json(result);
    }

    if (action === 'fetchPages' && propertyId && startDate && endDate) {
      const result = await service.fetchPages(propertyId, startDate, endDate);
      return NextResponse.json(result);
    }

    if (action === 'fetchTrafficSources' && propertyId && startDate && endDate) {
      const result = await service.fetchTrafficSources(propertyId, startDate, endDate);
      return NextResponse.json(result);
    }

    if (action === 'fetchEvents' && propertyId && startDate && endDate) {
      const result = await service.fetchEvents(propertyId, startDate, endDate);
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: 'Ação inválida ou parâmetros ausentes' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
