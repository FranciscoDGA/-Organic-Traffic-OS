import { NextResponse } from 'next/server';
import { PublishingService } from '../../../../../../organic-traffic-os/publishing/engine/publishing-service';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = new PublishingService();
  return NextResponse.json(service.getPackage(id));
}
