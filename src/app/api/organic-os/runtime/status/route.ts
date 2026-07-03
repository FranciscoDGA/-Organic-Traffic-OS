import { NextResponse } from 'next/server';
import { getRuntimeService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getRuntimeService();
    const status = service.getStatus();
    return NextResponse.json({ success: true, data: status });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
