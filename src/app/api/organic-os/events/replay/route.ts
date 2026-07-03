import { NextRequest, NextResponse } from 'next/server';
import { getEventBusService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getEventBusService();
  const body = await request.json();
  const { eventIds } = body;
  if (!eventIds || !Array.isArray(eventIds)) return NextResponse.json({ error: 'eventIds obrigatorio' }, { status: 400 });
  const results = await svc.replay(eventIds);
  return NextResponse.json({ replayed: results.length, events: results });
}
