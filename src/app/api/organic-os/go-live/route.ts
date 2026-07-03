import { NextResponse } from 'next/server';
import { getPRGCService } from './_service-singleton';

export async function GET() {
  const svc = getPRGCService();
  const latest = svc.getLatest();
  return NextResponse.json(latest || { status: 'pending', message: 'Nenhuma validacao executada' });
}
