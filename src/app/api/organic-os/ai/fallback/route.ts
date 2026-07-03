import { NextRequest, NextResponse } from 'next/server';
import { getAILService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getAILService();
  const body = await request.json();
  const { providerId } = body;
  if (!providerId) return NextResponse.json({ error: 'providerId obrigatorio' }, { status: 400 });
  const provider = svc.getProvider(providerId);
  if (!provider) return NextResponse.json({ error: 'Provider nao encontrado' }, { status: 404 });
  return NextResponse.json({ provider, health: svc.getHealth().find(h => h.providerId === providerId) });
}
