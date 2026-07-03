import { NextResponse } from 'next/server';
import { getCertificationService } from '../_service-singleton';

export async function GET() {
  const svc = getCertificationService();
  const latest = svc.getLatest();
  if (!latest) return NextResponse.json([]);
  return NextResponse.json(latest.workspaces);
}
