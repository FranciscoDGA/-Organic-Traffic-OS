import { NextRequest, NextResponse } from 'next/server';
import { getWpService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, content, excerpt, categories, tags, metadata } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ success: false, error: 'title, slug, and content are required' }, { status: 400 });
    }

    const service = getWpService();
    const result = await service.createDraft({ title, slug, content, excerpt, categories, tags, metadata });
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
