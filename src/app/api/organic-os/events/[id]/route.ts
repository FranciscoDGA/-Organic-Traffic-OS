import { NextRequest, NextResponse } from 'next/server';
import { getEventBusService } from '../_service-singleton';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const svc = getEventBusService();
  const event = svc.getEvent(id);
  if (!event) return NextResponse.json({ error: 'Evento nao encontrado' }, { status: 404 });
  return NextResponse.json(event);
}
