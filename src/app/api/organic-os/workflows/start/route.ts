import { NextResponse } from 'next/server';
import { WorkflowService } from '../../../../../../organic-traffic-os/orchestrator/engine/workflow-service';

export async function POST(req: Request) {
  try {
    const { blogId } = await req.json();
    const service = new WorkflowService();
    return NextResponse.json(service.startPipeline(blogId));
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
