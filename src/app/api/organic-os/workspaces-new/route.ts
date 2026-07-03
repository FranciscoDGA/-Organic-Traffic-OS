import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceService } from './_service-singleton';

export async function GET() {
  const svc = getWorkspaceService();
  return NextResponse.json(svc.getAll());
}

export async function POST(request: NextRequest) {
  const svc = getWorkspaceService();
  const body = await request.json();
  const result = svc.create(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }
  return NextResponse.json(result.workspace, { status: 201 });
}
