import { NextResponse } from 'next/server';
import { PipelineRunner } from '../../../../../../organic-traffic-os/e2e/runner/pipeline-runner';

export async function POST(req: Request) {
  try {
    const { tema } = await req.json();
    const runner = new PipelineRunner();
    return NextResponse.json(runner.runE2E(tema || 'Teste Padrao'));
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
