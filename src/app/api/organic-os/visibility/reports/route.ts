import { NextResponse } from 'next/server';
import { VisibilityService } from '../../../../../../organic-traffic-os/visibility/engine/visibility-service';

export async function GET() {
  const service = new VisibilityService();
  return NextResponse.json(service.listReports());
}
