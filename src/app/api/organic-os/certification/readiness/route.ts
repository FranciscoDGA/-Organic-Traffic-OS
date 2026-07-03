import { NextResponse } from 'next/server';
import { getCertificationService } from '../_service-singleton';

export async function GET() {
  const svc = getCertificationService();
  return NextResponse.json(svc.getReadiness());
}
