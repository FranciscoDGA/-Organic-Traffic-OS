import { NextResponse } from 'next/server';
import { PerformanceService } from '../../../../../../organic-traffic-os/performance/engine/performance-service';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const service = new PerformanceService();
    return NextResponse.json(service.registerAndAnalyze(data));
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
