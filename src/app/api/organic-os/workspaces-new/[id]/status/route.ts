import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceService } from '../../_service-singleton';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const svc = getWorkspaceService();
  const status = svc.getStatus(id);
  if (!status.exists) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
  return NextResponse.json(status);
}
