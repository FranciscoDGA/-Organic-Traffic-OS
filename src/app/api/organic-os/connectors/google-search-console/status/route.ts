import { NextResponse } from 'next/server';
import { getGscService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getGscService();
    const status = service.getStatus();
    return NextResponse.json({ success: true, data: status });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
