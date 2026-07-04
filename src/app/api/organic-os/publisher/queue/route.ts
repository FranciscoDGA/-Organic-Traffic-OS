import { NextResponse } from 'next/server';

export async function GET() { return disableResponse(); }
export async function POST() { return disableResponse(); }
export async function PUT() { return disableResponse(); }
export async function DELETE() { return disableResponse(); }
export async function PATCH() { return disableResponse(); }

function disableResponse() {
  return NextResponse.json({
    status: "disabled",
    reason: "Legacy scaffold isolated from production build"
  });
}
