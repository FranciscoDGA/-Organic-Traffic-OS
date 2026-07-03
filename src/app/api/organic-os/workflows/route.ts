import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([{ id: "1", status: "Running", etapa_atual: "SERP" }]);
}
