import { NextResponse } from 'next/server';
import { getOBIService } from '../_service-singleton';

export async function GET() {
  const svc = getOBIService();
  return NextResponse.json(svc.getAlerts());
}
