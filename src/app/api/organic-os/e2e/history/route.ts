import { NextResponse } from 'next/server';
import { PipelineRunner } from '../../../../../../organic-traffic-os/e2e/runner/pipeline-runner';

export async function GET() {
  const runner = new PipelineRunner();
  return NextResponse.json(runner.getHistory());
}
