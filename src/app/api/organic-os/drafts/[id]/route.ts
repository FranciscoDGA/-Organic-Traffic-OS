import { NextResponse } from 'next/server';
import { DraftService } from '../../../../../../organic-traffic-os/draft-writer/engine/draft-service';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = new DraftService();
  return NextResponse.json(service.getDraft(id));
}
