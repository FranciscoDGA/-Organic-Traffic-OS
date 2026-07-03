import { NextRequest, NextResponse } from 'next/server';
import { getCertificationService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getCertificationService();
  const body = await request.json().catch(() => ({}));
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const result = svc.approveGoLive(id);
  return NextResponse.json({ success: result, authorized: result });
}
