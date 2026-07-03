import { NextResponse } from 'next/server';
import { PlannerService } from '@shared/editorial/planner/planner-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blog_id') || 'passacumaru';

    const items = PlannerService.getEditorialItems(blogId);
    return NextResponse.json({ status: 'success', data: items });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
