import { NextResponse } from 'next/server';
import { QualityService } from '../../../../../../../organic-traffic-os/quality-review/engine/quality-service';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = new QualityService();
  return NextResponse.json(service.getReport(id));
}
