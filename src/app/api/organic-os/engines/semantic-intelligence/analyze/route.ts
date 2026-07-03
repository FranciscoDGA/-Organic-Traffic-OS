import { NextRequest, NextResponse } from 'next/server';
import { getSemanticIntelligenceService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const service = getSemanticIntelligenceService();
    const report = await service.runAnalysis(body);
    return NextResponse.json({ success: true, data: report });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
