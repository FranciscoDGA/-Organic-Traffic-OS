import { NextRequest, NextResponse } from 'next/server';
import { getDOCService } from './_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getDOCService();
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  if (date) {
    const ops = svc.getDay(date);
    if (!ops) return NextResponse.json({ error: 'Dia nao encontrado' }, { status: 404 });
    return NextResponse.json(ops);
  }
  const latest = svc.getLatest();
  if (!latest) return svc.startDay() ? NextResponse.json(svc.getLatest()) : NextResponse.json({ operations: svc.getAll() });
  return NextResponse.json(latest);
}
