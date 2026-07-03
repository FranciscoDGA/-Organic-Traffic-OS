import { NextResponse } from 'next/server';
import { InventoryLoader } from '@shared/inventory/inventory-loader';
import { InventoryValidator } from '@shared/inventory/inventory-validator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blog_id') || 'passacumaru';

    const validation = InventoryValidator.validate(blogId);
    
    if (!validation.isValid) {
      return NextResponse.json({
        status: 'error',
        validation,
        data: null
      }, { status: 400 });
    }

    const data = InventoryLoader.load(blogId);

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
