import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceKnowledgeService } from '../../_service-singleton';

export async function GET(request: NextRequest, { params }: { params: Promise<{ workspace: string }> }) {
  const { workspace } = await params;
  try {
    const svc = getWorkspaceKnowledgeService();
    const entities = svc.getEntities(workspace);
    return NextResponse.json(entities);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}
