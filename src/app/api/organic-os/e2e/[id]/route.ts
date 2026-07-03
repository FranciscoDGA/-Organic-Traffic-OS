import { NextResponse } from 'next/server';
import { PipelineRunner } from '../../../../../../organic-traffic-os/e2e/runner/pipeline-runner';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const runner = new PipelineRunner();
  return NextResponse.json(runner.getHistory().find(h => h.id === id) || {});
}
