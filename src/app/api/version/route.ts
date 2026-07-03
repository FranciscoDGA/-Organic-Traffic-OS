import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Organic Traffic OS',
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
    node: process.version,
    buildTime: process.env.BUILD_TIME || new Date().toISOString(),
    commitHash: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
  });
}
