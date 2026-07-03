import { NextResponse } from 'next/server';
import { getSemanticIntelligenceService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getSemanticIntelligenceService();
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
          total_items: report.total_items,
          total_entities: report.total_entities,
          total_topics: report.total_topics,
          total_questions: report.total_questions,
          total_gaps: report.total_gaps,
          overall_scores: report.overall_scores,
        },
        history,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
