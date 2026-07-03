import { NextResponse } from 'next/server';
import { getPredictiveIntelligenceService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getPredictiveIntelligenceService();
    const scenarios = service.getScenarios();
    return NextResponse.json({ success: true, data: scenarios });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
