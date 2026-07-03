import { NextRequest, NextResponse } from 'next/server';
import { getOEVService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getOEVService();
  const body = await request.json().catch(() => ({}));
  const { missionId } = body;
  if (!missionId) return NextResponse.json({ error: 'missionId obrigatorio' }, { status: 400 });
  const mission = svc.replay(missionId);
  if (!mission) return NextResponse.json({ error: 'Missao original nao encontrada' }, { status: 404 });
  return NextResponse.json(mission, { status: 201 });
}
