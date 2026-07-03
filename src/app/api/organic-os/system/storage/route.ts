import { NextResponse } from 'next/server';
import { getBuckets, getPublicBuckets, getPrivateBuckets, getTotalBuckets } from '../../../../../../organic-traffic-os/core/database/storage';

export async function GET() {
  const buckets = getBuckets();
  return NextResponse.json({
    success: true,
    data: {
      buckets,
      total: getTotalBuckets(),
      public: getPublicBuckets().length,
      private: getPrivateBuckets().length,
    },
  });
}
