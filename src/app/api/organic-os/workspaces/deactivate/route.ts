import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceOnboardingService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getWorkspaceOnboardingService();
  const body = await request.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'id obrigatorio' }, { status: 400 });
  const ok = svc.deactivate(id);
  if (!ok) return NextResponse.json({ error: 'Nao foi possivel desativar' }, { status: 400 });
  return NextResponse.json({ success: true });
}
