import { NextResponse } from 'next/server';
import { getAOVService } from '../_service-singleton';

export async function GET() {
  const svc = getAOVService();
  return NextResponse.json(svc.getHealth());
}
