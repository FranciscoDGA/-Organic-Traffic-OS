import { NextRequest, NextResponse } from 'next/server';
import { getMissionPlannerService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getMissionPlannerService();
  const body = await request.json();
  const { planId, objective, workspace } = body;
  if (!planId) return NextResponse.json({ error: 'planId obrigatorio' }, { status: 400 });
  const plan = svc.replan(planId, objective, workspace);
  if (!plan) return NextResponse.json({ error: 'Plano nao encontrado ou invalido' }, { status: 400 });
  return NextResponse.json(plan);
}
