import { NextResponse } from 'next/server';
import { QualityService } from '../../../../../../organic-traffic-os/quality-review/engine/quality-service';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const service = new QualityService();
    return NextResponse.json(service.reviewDraft(data));
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
