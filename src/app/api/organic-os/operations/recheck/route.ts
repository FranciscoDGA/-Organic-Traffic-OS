import { NextResponse } from 'next/server';
import { getOOCService } from '../_service-singleton';

export async function POST() {
  const svc = getOOCService();
  svc.recheck();
  return NextResponse.json({ success: true, message: 'Recheck concluido' });
}
