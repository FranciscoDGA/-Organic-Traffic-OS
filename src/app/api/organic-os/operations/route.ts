import { NextResponse } from 'next/server';
import { getOOCService } from './_service-singleton';

export async function GET() {
  const svc = getOOCService();
  svc.initialize();
  return NextResponse.json({ status: 'running', message: 'Organic Operations Center ativo' });
}
