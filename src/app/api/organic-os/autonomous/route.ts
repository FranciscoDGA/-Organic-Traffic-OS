import { NextResponse } from 'next/server';
import { getAOVService } from './_service-singleton';

export async function GET() {
  const svc = getAOVService();
  const latest = svc.getLatest();
  return NextResponse.json(latest || { status: 'idle', message: 'Nenhuma simulacao executada' });
}
