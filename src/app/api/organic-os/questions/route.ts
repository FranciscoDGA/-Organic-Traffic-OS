import { NextResponse } from 'next/server';
import { KeywordService } from '@shared/keywords/keyword-service';
import { KeywordValidator } from '@shared/keywords/keyword-validator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blog_id') || 'passacumaru';

    const validation = KeywordValidator.validate(blogId);
    if (!validation.isValid) {
      return NextResponse.json({ status: 'error', validation, data: null }, { status: 400 });
    }

    const service = new KeywordService(blogId);
    return NextResponse.json({ status: 'success', data: service['data'].questions });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
