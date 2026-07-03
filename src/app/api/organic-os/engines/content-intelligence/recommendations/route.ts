import { NextResponse } from 'next/server';
import { getContentIntelligenceService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getContentIntelligenceService();
    const recommendations = service.getRecommendations();
    return NextResponse.json({ success: true, data: recommendations });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
