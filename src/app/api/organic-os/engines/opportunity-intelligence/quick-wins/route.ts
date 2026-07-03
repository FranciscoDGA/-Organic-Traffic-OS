import { NextResponse } from 'next/server';
import { getOpportunityIntelligenceService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getOpportunityIntelligenceService();
    const quickWins = service.getQuickWins();
    return NextResponse.json({ success: true, data: quickWins });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
