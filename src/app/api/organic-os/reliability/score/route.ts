import { NextResponse } from 'next/server';
import { getORECService } from '../_service-singleton';

export async function GET() {
  const svc = getORECService();
  return NextResponse.json(svc.getScore());
}
