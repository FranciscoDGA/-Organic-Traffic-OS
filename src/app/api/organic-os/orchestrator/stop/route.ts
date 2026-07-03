import { NextResponse } from 'next/server';
import { getOrchestratorService } from '../_service-singleton';

export async function POST() {
  try {
    const service = getOrchestratorService();
    const stopped = service.stopExecution();
    return NextResponse.json({
      success: true,
      data: { stopped, message: stopped ? 'Execution cancelled' : 'No execution running' },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
