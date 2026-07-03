import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceOnboardingService } from './_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getWorkspaceOnboardingService();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const ws = svc.getById(id);
    if (!ws) return NextResponse.json({ error: 'Workspace nao encontrado' }, { status: 404 });
    return NextResponse.json(ws);
  }
  return NextResponse.json(svc.getAll());
}
