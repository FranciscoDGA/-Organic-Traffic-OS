import { NextRequest, NextResponse } from 'next/server';
import { getWorkflowService } from './_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getWorkflowService();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const def = svc.getDefinition(id);
    if (!def) return NextResponse.json({ error: 'Template nao encontrado' }, { status: 404 });
    return NextResponse.json(def);
  }
  return NextResponse.json(svc.getDefinitions());
}
