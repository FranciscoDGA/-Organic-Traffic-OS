import { NextResponse } from 'next/server';
import { getHeadlessCmsService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getHeadlessCmsService();
    const result = service.getLastSyncResult();

    if (!result) {
      return NextResponse.json({
        success: true,
        data: { connected: false, provider: '', total_collections: 0, total_content: 0, errors: [], logs: [] },
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
