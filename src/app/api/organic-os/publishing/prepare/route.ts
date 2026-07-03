import { NextResponse } from 'next/server';
import { PublishingService } from '../../../../../../organic-traffic-os/publishing/engine/publishing-service';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const service = new PublishingService();
    return NextResponse.json(service.prepare(data));
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
