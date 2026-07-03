import { NextResponse } from 'next/server';
import { getNewsletterService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getNewsletterService();
    const result = service.getLastSyncResult();

    if (!result) {
      return NextResponse.json({
        success: true,
        data: { connected: false, provider: '', total_audiences: 0, total_campaigns: 0, errors: [], warnings: [], logs: [] },
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
