import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceEditorialService } from '../_service-singleton';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const svc = getWorkspaceEditorialService();
  const profile = svc.getById(id);
  if (!profile) return NextResponse.json({ error: 'Perfil nao encontrado' }, { status: 404 });
  return NextResponse.json(profile);
}
