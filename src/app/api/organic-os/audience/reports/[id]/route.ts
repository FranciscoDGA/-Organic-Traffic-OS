import { NextResponse } from 'next/server';
import { AudienceService } from '../../../../../../../organic-traffic-os/audience-adaptation/engine/audience-service';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = new AudienceService();
  return NextResponse.json(service.getReport(id));
}
