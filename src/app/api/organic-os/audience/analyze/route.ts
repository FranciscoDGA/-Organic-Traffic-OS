import { NextResponse } from 'next/server';
import { AudienceService } from '../../../../../../organic-traffic-os/audience-adaptation/engine/audience-service';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const service = new AudienceService();
    return NextResponse.json(service.analyzeDraft(data));
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
