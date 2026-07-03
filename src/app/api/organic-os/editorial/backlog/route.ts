import { NextResponse } from 'next/server';
import { PlannerService } from '@shared/editorial/planner/planner-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blog_id') || 'passacumaru';

    const back = PlannerService.getBacklog(blogId);
    return NextResponse.json({ status: 'success', data: back });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
