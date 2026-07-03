import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceEditorialService } from '../_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getWorkspaceEditorialService();
  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');
  if (workspace) return NextResponse.json(svc.getPersonas(workspace));
  const all = svc.getAll().flatMap(p => p.personas.map(per => ({ ...per, workspaceId: p.workspaceId })));
  return NextResponse.json(all);
}
