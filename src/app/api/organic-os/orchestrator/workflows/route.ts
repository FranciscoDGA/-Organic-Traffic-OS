import { NextResponse } from 'next/server';
import { getOrchestratorService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getOrchestratorService();
    const workflows = service.getWorkflows();
    return NextResponse.json({ success: true, data: workflows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
