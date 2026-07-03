import { NextResponse } from 'next/server';
import { getORECService } from './_service-singleton';

export async function GET() {
  const svc = getORECService();
  const latest = svc.getLatest();
  return NextResponse.json(latest || { status: 'pending', message: 'Nenhum relatorio gerado' });
}
