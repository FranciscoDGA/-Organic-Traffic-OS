import { NextRequest, NextResponse } from 'next/server';
import { getWpService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getWpService();
    const result = service.getLastSyncResult();

    if (!result) {
      return NextResponse.json({
        success: true,
        data: { connected: false, site_url: '', total_posts: 0, total_categories: 0, total_tags: 0, errors: [], logs: [] },
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
