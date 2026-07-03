import { NextRequest, NextResponse } from 'next/server';
import { getRssSitemapService } from '../_service-singleton';

export async function GET(req: NextRequest) {
  try {
    const domain = req.nextUrl.searchParams.get('domain');
    if (!domain) {
      return NextResponse.json({ success: false, error: 'Domain is required' }, { status: 400 });
    }

    const service = getRssSitemapService(domain);
    const urls = service.getUrls();

    return NextResponse.json({ success: true, data: urls });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
