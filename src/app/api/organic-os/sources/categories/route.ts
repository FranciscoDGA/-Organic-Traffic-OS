import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    "Site Oficial",
    "Edital",
    "Lei",
    "Diário Oficial"
  ]);
}
