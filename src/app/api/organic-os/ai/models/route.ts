import { NextRequest, NextResponse } from 'next/server';
import { getAILService } from '../_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getAILService();
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get('provider');
  return NextResponse.json(svc.getModels(providerId || undefined));
}
