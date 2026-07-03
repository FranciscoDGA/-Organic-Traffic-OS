import { NextResponse } from 'next/server';
import { AudienceService } from '../../../../../../organic-traffic-os/audience-adaptation/engine/audience-service';

export async function GET() {
  const service = new AudienceService();
  return NextResponse.json(service.listReports());
}
