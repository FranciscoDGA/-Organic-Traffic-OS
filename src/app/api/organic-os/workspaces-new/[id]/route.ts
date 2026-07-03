import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceService } from '../_service-singleton';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const svc = getWorkspaceService();
  const workspace = svc.getById(id);
  if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
  return NextResponse.json(workspace);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const svc = getWorkspaceService();
  const body = await request.json();
  const result = svc.update(id, body);
  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }
  return NextResponse.json(result.workspace);
}
