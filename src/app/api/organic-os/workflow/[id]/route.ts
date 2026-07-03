import { NextRequest, NextResponse } from 'next/server';
import { getWorkflowService } from '../_service-singleton';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const svc = getWorkflowService();
  const def = svc.getDefinition(id);
  if (!def) return NextResponse.json({ error: 'Template nao encontrado' }, { status: 404 });
  const dag = svc.getDAG(id);
  return NextResponse.json({ definition: def, dag });
}
