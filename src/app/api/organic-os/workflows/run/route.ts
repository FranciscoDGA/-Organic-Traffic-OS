import { NextResponse } from 'next/server';
import { SharedRuntime } from '../../../../../../shared/runtime/shared-runtime';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { blog_id, workflow_id } = body;

    if (!blog_id || !workflow_id) {
      return NextResponse.json(
        { error: 'Missing blog_id or workflow_id' },
        { status: 400 }
      );
    }

    if (workflow_id === 'organic_content_pipeline_v1') {
      const result = await SharedRuntime.runWorkflowStep('discovery-agent', 'analyze_blog', { blog_id });
      return NextResponse.json({ status: 'success', data: result });
    }

    return NextResponse.json(
      { error: 'Unknown workflow_id' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
