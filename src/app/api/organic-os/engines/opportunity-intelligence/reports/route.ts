import { NextResponse } from 'next/server';
import { getOpportunityIntelligenceService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getOpportunityIntelligenceService();
    const report = service.getLastReport();

    if (!report) {
      return NextResponse.json({ success: true, data: { reports: [], message: 'No reports yet.' } });
    }

    const history = service.getHistory();
    return NextResponse.json({
      success: true,
      data: {
        latest: {
          timestamp: report.timestamp,
          total_opportunities: report.total_opportunities,
          quick_wins_count: report.quick_wins.length,
          overall_scores: report.overall_scores,
        },
        history,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
