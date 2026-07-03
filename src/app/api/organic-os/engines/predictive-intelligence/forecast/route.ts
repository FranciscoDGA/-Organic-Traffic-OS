import { NextResponse } from 'next/server';
import { getPredictiveIntelligenceService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getPredictiveIntelligenceService();
    const forecast = service.getForecast();
    return NextResponse.json({ success: true, data: forecast });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
