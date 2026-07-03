import { NextRequest, NextResponse } from 'next/server';
import { getAILService } from '../_service-singleton';

export async function GET(request: NextRequest) {
  const svc = getAILService();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const provider = svc.getProvider(id);
    if (!provider) return NextResponse.json({ error: 'Provider nao encontrado' }, { status: 404 });
    return NextResponse.json(provider);
  }
  return NextResponse.json(svc.getProviders());
}
