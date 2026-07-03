import { NextRequest, NextResponse } from 'next/server';
import { getMissionPlannerService } from './_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getMissionPlannerService();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const plan = svc.getPlan(id);
    if (!plan) return NextResponse.json({ error: 'Plano nao encontrado' }, { status: 404 });
    return NextResponse.json(plan);
  }
  return NextResponse.json({ plans: svc.getAllPlans(), strategies: svc.getStrategies() });
}
