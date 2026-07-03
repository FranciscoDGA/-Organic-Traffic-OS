import { NextRequest, NextResponse } from 'next/server';
import { getOrchestratorService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workflow_id, ...params } = body;

    if (!workflow_id) {
      return NextResponse.json({ success: false, error: 'workflow_id is required' }, { status: 400 });
    }

    const service = getOrchestratorService();
    const result = await service.runWorkflow(workflow_id, params);
    return NextResponse.json({ success: result.success, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
