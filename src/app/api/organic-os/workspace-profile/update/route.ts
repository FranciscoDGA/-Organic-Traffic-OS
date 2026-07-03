import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceEditorialService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getWorkspaceEditorialService();
  const body = await request.json();
  const { workspaceId, updates } = body;
  if (!workspaceId) return NextResponse.json({ error: 'workspaceId obrigatorio' }, { status: 400 });
  const ok = svc.updateProfile(workspaceId, updates);
  if (!ok) return NextResponse.json({ error: 'Perfil nao encontrado' }, { status: 404 });
  return NextResponse.json({ success: true });
}
