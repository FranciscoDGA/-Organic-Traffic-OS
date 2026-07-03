import { NextResponse } from 'next/server';
import { VisibilityService } from '../../../../../../organic-traffic-os/visibility/engine/visibility-service';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const service = new VisibilityService();
    return NextResponse.json(service.optimizeDraft(data));
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
