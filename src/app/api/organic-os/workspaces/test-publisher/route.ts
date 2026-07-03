import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceOnboardingService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getWorkspaceOnboardingService();
  const body = await request.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'id obrigatorio' }, { status: 400 });
  const result = svc.testPublisher(id);
  return NextResponse.json(result);
}
