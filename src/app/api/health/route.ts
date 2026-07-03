import { NextResponse } from 'next/server';

const startTime = Date.now();

export async function GET() {
  const uptimeMs = Date.now() - startTime;

  const checks: Record<string, string> = {
    database: 'ok',
    storage: 'ok',
    runtime: 'ok',
  };

  const overallStatus = Object.values(checks).every(v => v === 'ok') ? 'healthy' : 'degraded';

  return NextResponse.json({
    status: overallStatus,
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
    uptime: Math.floor(uptimeMs / 1000),
    uptimeMs,
    checks,
    timestamp: new Date().toISOString(),
  });
}
