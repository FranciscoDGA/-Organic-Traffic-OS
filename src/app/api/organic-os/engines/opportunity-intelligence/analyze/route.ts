import { NextRequest, NextResponse } from 'next/server';
import { getOpportunityIntelligenceService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const service = getOpportunityIntelligenceService();
    const report = await service.runAnalysis({ direct_input: body });
    return NextResponse.json({ success: true, data: report });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
