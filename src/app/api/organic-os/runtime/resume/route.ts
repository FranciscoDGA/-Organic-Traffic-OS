import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeService } from '../../../../../../organic-traffic-os/core/ore/runtime.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId } = body;
    if (!jobId) return NextResponse.json({ success: false, error: 'jobId required' }, { status: 400 });
    const service = getRuntimeService();
    const success = service.resumeJob(jobId);
    return NextResponse.json({ success, data: { jobId, resumed: success } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
