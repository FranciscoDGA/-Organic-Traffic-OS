import { NextResponse } from 'next/server';
import { getORECService } from '../_service-singleton';

export async function GET() {
  const svc = getORECService();
  const latest = svc.getLatest();
  if (!latest) return NextResponse.json({ recommendations: [] });
  return NextResponse.json({ recommendations: latest.recommendations });
}
