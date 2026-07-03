import { NextRequest, NextResponse } from 'next/server';
import { getNewsletterService, resetNewsletterService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, provider, api_key } = body;

    if (action === 'connect') {
      if (!provider) return NextResponse.json({ success: false, error: 'provider is required' }, { status: 400 });
      if (provider !== 'mock' && !api_key) return NextResponse.json({ success: false, error: 'api_key is required' }, { status: 400 });

      resetNewsletterService();
      const service = getNewsletterService({ provider, api_key });
      const result = await service.connect();
      return NextResponse.json({ success: true, data: result });
    }

    if (action === 'disconnect') {
      const service = getNewsletterService();
      service.disconnect();
      resetNewsletterService();
      return NextResponse.json({ success: true, data: { disconnected: true } });
    }

    if (action === 'sync') {
      const service = getNewsletterService();
      const result = await service.sync();
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
