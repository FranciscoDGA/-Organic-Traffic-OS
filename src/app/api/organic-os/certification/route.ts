import { NextResponse } from 'next/server';
import { getCertificationService } from './_service-singleton';

export async function GET() {
  const svc = getCertificationService();
  const latest = svc.getLatest();
  return NextResponse.json(latest || { status: 'pending', message: 'Nenhuma certificacao executada' });
}
