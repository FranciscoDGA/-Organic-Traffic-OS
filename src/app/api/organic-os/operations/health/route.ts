import { NextResponse } from 'next/server';
import { getOOCService } from '../_service-singleton';

export async function GET() {
  const svc = getOOCService();
  return NextResponse.json({ status: svc.getStatus(), components: svc.getComponents() });
}
