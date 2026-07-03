import { NextResponse } from 'next/server';
import { getEventBusService } from '../_service-singleton';

export async function GET() {
  const svc = getEventBusService();
  return NextResponse.json({ events: svc.getRecentEvents(50), stats: svc.getStats() });
}
