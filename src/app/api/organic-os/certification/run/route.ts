import { NextResponse } from 'next/server';
import { getCertificationService } from '../_service-singleton';

export async function POST() {
  const svc = getCertificationService();
  const result = svc.run();
  return NextResponse.json(result, { status: 201 });
}
