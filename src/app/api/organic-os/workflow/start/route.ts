import { NextRequest, NextResponse } from 'next/server';
import { getWorkflowService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getWorkflowService();
  const body = await request.json();
  const { workflowId, context } = body;
  if (!workflowId) return NextResponse.json({ error: 'workflowId obrigatorio' }, { status: 400 });
  const exec = svc.start(workflowId, context);
  if (!exec) return NextResponse.json({ error: 'Workflow invalido ou nao encontrado' }, { status: 400 });
  return NextResponse.json(exec, { status: 201 });
}
