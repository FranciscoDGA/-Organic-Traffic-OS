import { NextRequest, NextResponse } from 'next/server';
import { getMissionPlannerService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getMissionPlannerService();
  const body = await request.json();
  const { objective, workspace } = body;
  if (!objective || !workspace) return NextResponse.json({ error: 'objective e workspace obrigatorios' }, { status: 400 });
  const plan = svc.createPlan(objective, workspace);
  if (!plan) return NextResponse.json({ error: 'Nao foi possivel criar o plano' }, { status: 400 });
  return NextResponse.json(plan, { status: 201 });
}
