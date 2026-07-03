import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceEditorialService } from './_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getWorkspaceEditorialService();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const workspace = searchParams.get('workspace');
  if (id) {
    const profile = svc.getById(id);
    if (!profile) return NextResponse.json({ error: 'Perfil nao encontrado' }, { status: 404 });
    return NextResponse.json(profile);
  }
  if (workspace) {
    const profile = svc.getByWorkspace(workspace);
    if (!profile) return NextResponse.json({ error: 'Perfil nao encontrado' }, { status: 404 });
    return NextResponse.json(profile);
  }
  return NextResponse.json(svc.getAll());
}
