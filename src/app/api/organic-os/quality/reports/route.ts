import { NextResponse } from 'next/server';
import { QualityService } from '../../../../../../organic-traffic-os/quality-review/engine/quality-service';

export async function GET() {
  const service = new QualityService();
  return NextResponse.json(service.listReports());
}
