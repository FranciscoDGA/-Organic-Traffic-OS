import { NextResponse } from 'next/server';
import { PlannerService } from '@shared/editorial/planner/planner-service';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blog_id') || 'passacumaru';

    const result = await PlannerService.generate(blogId);
    return NextResponse.json({ status: 'success', message: 'Planejamento gerado', data: result });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
