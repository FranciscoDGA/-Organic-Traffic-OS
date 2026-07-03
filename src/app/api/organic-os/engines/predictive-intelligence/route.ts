import { NextResponse } from 'next/server';
import { getPredictiveIntelligenceService } from './_service-singleton';

export async function GET() {
  try {
    const service = getPredictiveIntelligenceService();
    const report = service.getLastReport();

    if (!report) {
      return NextResponse.json({
        success: true,
        data: {
          status: 'not_analyzed',
          message: 'No analysis has been run yet. POST to /analyze to start.',
          overall_scores: null,
          total_items: 0,
          items_analyzed: 0,
          warnings: [],
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        status: 'analyzed',
        timestamp: report.timestamp,
        total_items: report.total_items,
        items_analyzed: report.items_analyzed,
        overall_scores: report.overall_scores,
        scenarios_count: report.scenarios.length,
        recommendations_count: report.recommendations.length,
        warnings: report.warnings,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
