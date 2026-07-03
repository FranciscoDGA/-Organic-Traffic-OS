import { NextRequest, NextResponse } from 'next/server';
import { getAILService } from '../_service-singleton';

export async function POST(request: NextRequest) {
  const svc = getAILService();
  const body = await request.json();
  const { taskProfile, prompt } = body;
  if (!taskProfile || !prompt) return NextResponse.json({ error: 'taskProfile e prompt obrigatorios' }, { status: 400 });
  const result = await svc.execute(taskProfile, prompt, { useCache: false });
  return NextResponse.json(result);
}
