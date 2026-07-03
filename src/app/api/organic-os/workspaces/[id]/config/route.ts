import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceOnboardingService } from '../../_service-singleton';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const svc = getWorkspaceOnboardingService();
  const ws = svc.getById(id);
  if (!ws) return NextResponse.json({ error: 'Workspace nao encontrado' }, { status: 404 });
  return NextResponse.json({ identity: ws.identity, editorialProfile: ws.editorialProfile, policy: ws.policy, publisherConfig: ws.publisherConfig, kpis: ws.kpis });
}
