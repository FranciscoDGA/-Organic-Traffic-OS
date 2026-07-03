import { NextResponse } from 'next/server';
import { getRuntimeService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getRuntimeService();
    const events = service.getEvents(50);
    return NextResponse.json({ success: true, data: events });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
