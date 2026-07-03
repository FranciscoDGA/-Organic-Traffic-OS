import { NextRequest, NextResponse } from 'next/server';
import { getORECService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getORECService();
  const body = await request.json().catch(() => ({}));
  const period = body.period || 'daily';
  const report = svc.recalculate(period);
  return NextResponse.json(report, { status: 201 });
}
