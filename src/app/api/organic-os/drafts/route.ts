import { NextResponse } from 'next/server';
import { DraftService } from '../../../../../organic-traffic-os/draft-writer/engine/draft-service';

export async function GET() {
  const service = new DraftService();
  return NextResponse.json(service.listDrafts());
}
