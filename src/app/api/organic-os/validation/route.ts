import { NextRequest, NextResponse } from 'next/server';
import { getOEVService } from './_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getOEVService();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const mission = svc.getMission(id);
    if (!mission) return NextResponse.json({ error: 'Missao nao encontrada' }, { status: 404 });
    return NextResponse.json(mission);
  }
  return NextResponse.json(svc.getAllMissions());
}
