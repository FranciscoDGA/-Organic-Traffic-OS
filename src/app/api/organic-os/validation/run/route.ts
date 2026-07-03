import { NextResponse } from 'next/server';
import { getOEVService } from '../_service-singleton';

export async function POST() {
  const svc = getOEVService();
  const mission = svc.runValidation();
  return NextResponse.json(mission, { status: 201 });
}
