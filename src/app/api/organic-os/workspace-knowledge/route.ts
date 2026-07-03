import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceKnowledgeService } from './_service-singleton';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');
  if (!workspace) return NextResponse.json({ error: 'workspace param required' }, { status: 400 });
  try {
    const svc = getWorkspaceKnowledgeService();
    const context = svc.getContext(workspace);
    return NextResponse.json(context);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}
