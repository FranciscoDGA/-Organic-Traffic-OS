import { NextResponse } from 'next/server';
import { getSchedulerEngineInstance } from '../_service-singleton';

export async function GET() {
  try {
    const engine = getSchedulerEngineInstance();
    const status = engine.getManager().getStatus();
    return NextResponse.json({ success: true, data: { ...status, running: engine.isRunning(), uptimeMs: engine.getUptimeMs() } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
