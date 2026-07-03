import { NextResponse } from 'next/server';
import { PerformanceService } from '../../../../../../organic-traffic-os/performance/engine/performance-service';

export async function GET(req: Request, { params }: { params: Promise<{ content_id: string }> }) {
  const { content_id } = await params;
  const service = new PerformanceService();
  return NextResponse.json(service.getHistory(content_id));
}
