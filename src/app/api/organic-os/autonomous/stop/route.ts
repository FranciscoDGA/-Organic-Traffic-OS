import { NextResponse } from 'next/server';
import { getAOVService } from '../_service-singleton';

export async function POST() {
  const svc = getAOVService();
  svc.stop();
  return NextResponse.json({ success: true });
}
