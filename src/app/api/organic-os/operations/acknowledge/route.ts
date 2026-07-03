import { NextRequest, NextResponse } from 'next/server';
import { getOOCService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getOOCService();
  const body = await request.json().catch(() => ({}));
  const { alertId } = body;
  if (!alertId) return NextResponse.json({ error: 'alertId required' }, { status: 400 });
  const result = svc.acknowledgeAlert(alertId);
  return NextResponse.json({ success: result });
}
