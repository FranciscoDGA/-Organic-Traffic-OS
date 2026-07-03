import { NextResponse } from 'next/server';
import { getSemanticIntelligenceService } from './_service-singleton';

export async function GET() {
  try {
    const service = getSemanticIntelligenceService();
    const report = service.getLastReport();

    if (!report) {
      return NextResponse.json({
        success: true,
        data: {
          status: 'not_analyzed',
          message: 'No analysis has been run yet. POST to /analyze to start.',
          overall_scores: null,
          total_items: 0,
          total_entities: 0,
          total_topics: 0,
          total_questions: 0,
          total_gaps: 0,
          recommendations_count: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        status: 'analyzed',
        timestamp: report.timestamp,
        total_items: report.total_items,
        total_entities: report.total_entities,
        total_topics: report.total_topics,
        total_questions: report.total_questions,
        total_gaps: report.total_gaps,
        overall_scores: report.overall_scores,
        recommendations_count: report.recommendations.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
