import { NextResponse } from 'next/server';
import { ResearchService } from '../../../../../../organic-traffic-os/research-pack/engine/research-service';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = new ResearchService();
  return NextResponse.json(service.getPack(id));
}
