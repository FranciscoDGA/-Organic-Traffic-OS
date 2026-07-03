import { NextResponse } from 'next/server';
import { SourceService } from '../../../../../../organic-traffic-os/sources/engine/source-service';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = new SourceService();
  return NextResponse.json(service.getSource(id));
}
