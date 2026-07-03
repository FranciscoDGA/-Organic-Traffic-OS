import { NextRequest, NextResponse } from 'next/server';
import { getRssSitemapService, resetRssSitemapService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, domain } = body;

    if (!domain) {
      return NextResponse.json({ success: false, error: 'Domain is required' }, { status: 400 });
    }

    resetRssSitemapService();
    const service = getRssSitemapService(domain);

    if (action === 'connect') {
      const result = await service.connect();
      return NextResponse.json({ success: true, data: result });
    }

    if (action === 'disconnect') {
      service.disconnect();
      resetRssSitemapService();
      return NextResponse.json({ success: true, data: { disconnected: true } });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
