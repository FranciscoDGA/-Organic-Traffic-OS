import { NextRequest, NextResponse } from 'next/server';
import { getWpService, resetWpService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, site_url, username, app_password } = body;

    if (action === 'connect') {
      if (!site_url || !username || !app_password) {
        return NextResponse.json({ success: false, error: 'site_url, username, and app_password are required' }, { status: 400 });
      }
      resetWpService();
      const service = getWpService({ site_url, username, app_password });
      const result = await service.connect();
      return NextResponse.json({ success: true, data: result });
    }

    if (action === 'disconnect') {
      const service = getWpService();
      service.disconnect();
      resetWpService();
      return NextResponse.json({ success: true, data: { disconnected: true } });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
