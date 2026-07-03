import { NextRequest, NextResponse } from 'next/server';
import { getSchedulerEngineInstance } from '../../_service-singleton';

export async function GET(req: NextRequest) {
  try {
    const engine = getSchedulerEngineInstance();
    const jobs = engine.getManager().listJobs();
    return NextResponse.json({ success: true, data: jobs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const engine = getSchedulerEngineInstance();
    const result = engine.getManager().createJob(body);
    if (result.errors.length > 0) {
      return NextResponse.json({ success: false, errors: result.errors }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: result.job });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
