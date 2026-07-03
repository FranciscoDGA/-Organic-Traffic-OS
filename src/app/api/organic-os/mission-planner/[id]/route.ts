import { NextRequest, NextResponse } from 'next/server';
import { getMissionPlannerService } from '../_service-singleton';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const svc = getMissionPlannerService();
  const plan = svc.getPlan(id);
  if (!plan) return NextResponse.json({ error: 'Plano nao encontrado' }, { status: 404 });
  return NextResponse.json(plan);
}
