import { NextResponse } from 'next/server';
import { ArchitectService } from '../../../../../../organic-traffic-os/content-architecture/engine/architect-service';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = new ArchitectService();
  return NextResponse.json(service.getBlueprint(id));
}
