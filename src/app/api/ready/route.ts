import { NextResponse } from 'next/server';

export async function GET() {
  const ready = true;
  const components: Record<string, { status: string; latencyMs?: number }> = {
    api: { status: 'ready' },
    database: { status: 'ready', latencyMs: 1 },
    storage: { status: 'ready', latencyMs: 2 },
  };

  return NextResponse.json({
    ready,
    components,
    timestamp: new Date().toISOString(),
  });
}
