import { NextResponse } from 'next/server';
import { FactService } from '../../../../../../organic-traffic-os/facts/engine/fact-service';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = new FactService();
  return NextResponse.json(service.getFact(id));
}
