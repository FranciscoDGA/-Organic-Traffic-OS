import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: "01", name: "Chief Editor" },
    { id: "02", name: "Research Reviewer" },
    { id: "03", name: "Outline Reviewer" },
    { id: "04", name: "SEO Reviewer" },
    { id: "05", name: "Content Writer" },
    { id: "06", name: "Humanization Reviewer" },
    { id: "07", name: "Quality Reviewer" }
  ]);
}
