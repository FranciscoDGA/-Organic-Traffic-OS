import { NextRequest, NextResponse } from 'next/server';
import { getMissionPlannerService } from '../_service-singleton';

export async function GET() {
  const svc = getMissionPlannerService();
  return NextResponse.json(svc.getAllPlans());
}
