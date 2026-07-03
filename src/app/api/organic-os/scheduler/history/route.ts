import { NextResponse } from 'next/server';
import { getSchedulerEngineInstance } from '../_service-singleton';

export async function GET() {
  try {
    const engine = getSchedulerEngineInstance();
    const history = engine.getManager().getHistory();
    return NextResponse.json({ success: true, data: history });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
