import { NextResponse } from 'next/server';
import { getEventBusService } from '../_service-singleton';

export async function GET() {
  const svc = getEventBusService();
  return NextResponse.json(svc.getSubscriptions());
}
