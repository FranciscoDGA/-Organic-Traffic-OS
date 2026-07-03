import { NextResponse } from 'next/server';
import { getRuntimeService } from '../../../../../../organic-traffic-os/core/ore/runtime.service';

export async function GET() {
  const service = getRuntimeService();
  return NextResponse.json({ success: true, data: service.getWorkers() });
}
