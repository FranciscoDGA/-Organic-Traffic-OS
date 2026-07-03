import { NextResponse } from 'next/server';
import { getPRGCService } from '../_service-singleton';

export async function POST() {
  const svc = getPRGCService();
  const result = svc.validate();
  return NextResponse.json(result, { status: 201 });
}
