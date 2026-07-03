import { NextRequest, NextResponse } from 'next/server';
import { getSchedulerEngineInstance } from '../../../_service-singleton';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const engine = getSchedulerEngineInstance();
    const job = engine.getManager().getJob(id);
    if (!job) return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: job });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const engine = getSchedulerEngineInstance();
    let result;

    if (action === 'pause') {
      result = engine.getManager().pauseJob(id);
    } else if (action === 'resume') {
      result = engine.getManager().resumeJob(id);
    } else if (action === 'cancel') {
      result = engine.getManager().cancelJob(id);
    } else if (action === 'run-now') {
      result = await engine.getManager().runNow(id);
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    if (result.errors.length > 0) {
      return NextResponse.json({ success: false, errors: result.errors }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
