import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    fluxo: [
      "Brief", "Blueprint", "Research", "Fact Engine", "Source Engine",
      "Chief Editor", "Research Reviewer", "Outline Reviewer", "SEO Reviewer",
      "Content Writer", "Humanization Reviewer", "Quality Reviewer"
    ]
  });
}
