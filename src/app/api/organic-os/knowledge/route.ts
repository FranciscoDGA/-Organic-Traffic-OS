import { NextRequest, NextResponse } from 'next/server';
import { getKnowledgeService } from './_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getKnowledgeService();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const workspace = searchParams.get('workspace');
  if (category) return NextResponse.json(svc.searchKnowledge('', category, workspace || undefined));
  if (workspace) return NextResponse.json(svc.getWorkspaceKnowledgeFor(workspace));
  return NextResponse.json(svc.getAll());
}
