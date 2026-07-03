import { NextResponse } from 'next/server';
import { DraftService } from '../../../../../../organic-traffic-os/draft-writer/engine/draft-service';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const service = new DraftService();
    return NextResponse.json(service.createDraft(data));
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
