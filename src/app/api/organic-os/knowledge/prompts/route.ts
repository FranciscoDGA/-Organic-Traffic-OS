import { NextResponse } from 'next/server';
import { getKnowledgeService } from '../_service-singleton';

export async function GET() {
  const svc = getKnowledgeService();
  return NextResponse.json(svc.getPrompts());
}
