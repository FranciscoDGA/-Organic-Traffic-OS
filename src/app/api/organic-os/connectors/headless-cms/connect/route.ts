import { NextRequest, NextResponse } from 'next/server';
import { getHeadlessCmsService, resetHeadlessCmsService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, provider, api_url, api_token, project_id } = body;

    if (action === 'connect') {
      if (!provider) return NextResponse.json({ success: false, error: 'provider is required' }, { status: 400 });
      if (provider !== 'mock' && !api_url) return NextResponse.json({ success: false, error: 'api_url is required' }, { status: 400 });

      resetHeadlessCmsService();
      const service = getHeadlessCmsService({ provider, api_url, api_token, project_id });
      const result = await service.connect();
      return NextResponse.json({ success: true, data: result });
    }

    if (action === 'disconnect') {
      const service = getHeadlessCmsService();
      service.disconnect();
      resetHeadlessCmsService();
      return NextResponse.json({ success: true, data: { disconnected: true } });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
