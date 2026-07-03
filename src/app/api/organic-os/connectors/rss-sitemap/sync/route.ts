import { NextRequest, NextResponse } from 'next/server';
import { getRssSitemapService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json({ success: false, error: 'Domain is required' }, { status: 400 });
    }

    const service = getRssSitemapService(domain);
    const result = await service.sync();
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
