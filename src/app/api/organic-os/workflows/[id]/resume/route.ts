import { NextResponse } from 'next/server';
import { WorkflowService } from '../../../../../../../organic-traffic-os/orchestrator/engine/workflow-service';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = new WorkflowService();
  return NextResponse.json(service.resumeExecution(id));
}
