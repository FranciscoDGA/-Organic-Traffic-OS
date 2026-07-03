import { NextResponse } from 'next/server';
import { getAILService } from '../_service-singleton';

export async function GET() {
  const svc = getAILService();
  return NextResponse.json(svc.getCosts());
}
