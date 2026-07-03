import { NextRequest, NextResponse } from 'next/server';
import { getWorkflowService } from '../_service-singleton';

export async function GET() {
  const svc = getWorkflowService();
  return NextResponse.json(svc.getDefinitions());
}
