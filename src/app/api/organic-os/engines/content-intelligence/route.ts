import { NextResponse } from 'next/server';
import { getContentIntelligenceService } from './_service-singleton';

export async function GET() {
  try {
    const service = getContentIntelligenceService();
    const report = service.getLastReport();

    if (!report) {
      return NextResponse.json({
        success: true,
        data: {
          status: 'not_analyzed',
          message: 'No analysis has been run yet. POST to /analyze to start.',
          overall_scores: null,
          total_content: 0,
          total_analyzed: 0,
          recommendations_count: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        status: 'analyzed',
        timestamp: report.timestamp,
        total_content: report.total_content,
        total_analyzed: report.total_analyzed,
        overall_scores: report.overall_scores,
        recommendations_count: report.recommendations.length,
        critical_count: report.critical_content.length,
        promising_count: report.promising_content.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
