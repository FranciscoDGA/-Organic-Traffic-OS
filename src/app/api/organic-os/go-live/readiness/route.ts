import { NextResponse } from 'next/server';
import { getPRGCService } from '../_service-singleton';

export async function GET() {
  const svc = getPRGCService();
  return NextResponse.json(svc.getReadiness());
}
