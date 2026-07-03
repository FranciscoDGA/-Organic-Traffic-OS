import { NextRequest, NextResponse } from 'next/server';
import { getDOCService } from '../_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getDOCService();
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const ops = svc.getDay(date) || svc.startDay(date);
  return NextResponse.json(ops.briefing);
}
