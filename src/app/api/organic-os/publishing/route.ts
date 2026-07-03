import { NextResponse } from 'next/server';
import { PublishingService } from '../../../../../organic-traffic-os/publishing/engine/publishing-service';

export async function GET() {
  const service = new PublishingService();
  return NextResponse.json(service.listPackages());
}
