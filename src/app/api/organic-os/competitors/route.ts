import { NextResponse } from 'next/server';
import { CompetitorLoader } from '@shared/competitors/competitor-loader';
import { CompetitorValidator } from '@shared/competitors/competitor-validator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blog_id') || 'passacumaru';

    const validation = CompetitorValidator.validate(blogId);
    
    if (!validation.isValid) {
      return NextResponse.json({
        status: 'error',
        validation,
        data: null
      }, { status: 400 });
    }

    const data = CompetitorLoader.load(blogId);

    return NextResponse.json({
      status: 'success',
      validation,
      data
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', error: error.message },
      { status: 500 }
    );
  }
}
