import { NextRequest, NextResponse } from 'next/server';
import { getAOVService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getAOVService();
  const body = await request.json().catch(() => ({}));
  const result = svc.start(body);
  return NextResponse.json(result, { status: 201 });
}
