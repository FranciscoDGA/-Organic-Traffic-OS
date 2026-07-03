import { NextRequest, NextResponse } from 'next/server';
import { getKnowledgeService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getKnowledgeService();
  const body = await request.json();
  const { query, category, workspaceId } = body;
  return NextResponse.json(svc.searchKnowledge(query || '', category, workspaceId));
}
