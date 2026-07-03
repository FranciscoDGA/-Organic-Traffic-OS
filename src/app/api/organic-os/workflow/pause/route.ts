import { NextRequest, NextResponse } from 'next/server';
import { getWorkflowService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getWorkflowService();
  const body = await request.json();
  const { executionId } = body;
  if (!executionId) return NextResponse.json({ error: 'executionId obrigatorio' }, { status: 400 });
  const ok = svc.pause(executionId);
  if (!ok) return NextResponse.json({ error: 'Execucao nao encontrada ou nao esta rodando' }, { status: 400 });
  return NextResponse.json({ success: true });
}
