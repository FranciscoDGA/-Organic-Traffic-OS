import { NextResponse } from 'next/server';
import { getOpportunityIntelligenceService } from './_service-singleton';

export async function GET() {
  try {
    const service = getOpportunityIntelligenceService();
    const report = service.getLastReport();

    if (!report) {
      return NextResponse.json({
        success: true,
        data: {
          status: 'not_analyzed',
          message: 'No analysis has been run yet. POST to /analyze to start.',
          overall_scores: null,
          total_opportunities: 0,
          quick_wins_count: 0,
          signals_used: [],
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        status: 'analyzed',
        timestamp: report.timestamp,
        total_opportunities: report.total_opportunities,
        quick_wins_count: report.quick_wins.length,
        strategic_count: report.strategic_opportunities.length,
        refresh_count: report.refresh_opportunities.length,
        cluster_count: report.cluster_opportunities.length,
        conversion_count: report.conversion_opportunities.length,
        overall_scores: report.overall_scores,
        signals_used: report.signals_analyzed,
        recommendations_count: report.recommendations.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
