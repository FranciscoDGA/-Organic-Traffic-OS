import { NextRequest, NextResponse } from 'next/server';
import { getDOCService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getDOCService();
  const body = await request.json().catch(() => ({}));
  const date = body.date || new Date().toISOString().split('T')[0];
  const ops = svc.startDay(date);
  return NextResponse.json(ops);
}
