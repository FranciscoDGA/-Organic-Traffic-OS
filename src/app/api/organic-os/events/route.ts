import { NextRequest, NextResponse } from 'next/server';
import { getEventBusService } from './_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getEventBusService();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const event = svc.getEvent(id);
    if (!event) return NextResponse.json({ error: 'Evento nao encontrado' }, { status: 404 });
    return NextResponse.json(event);
  }
  const type = searchParams.get('type');
  const all = svc.getAllEvents();
  const filtered = type ? all.filter(e => e.event_type === type) : all;
  return NextResponse.json({ events: filtered, stats: svc.getStats() });
}
