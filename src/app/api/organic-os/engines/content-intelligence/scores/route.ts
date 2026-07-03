import { NextResponse } from 'next/server';
import { getContentIntelligenceService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getContentIntelligenceService();
    const scores = service.getScores();
    return NextResponse.json({ success: true, data: scores });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
