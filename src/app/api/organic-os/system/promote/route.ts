import { NextRequest, NextResponse } from 'next/server';
import { featureFlags } from '../../../../../../organic-traffic-os/core/infrastructure/feature-flags';
import { promote, getEnvironmentState } from '../../../../../../organic-traffic-os/core/infrastructure/environment/environment-state';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { from, to, notes } = body;

    if (!from || !to) {
      return NextResponse.json({ success: false, error: 'from and to are required' }, { status: 400 });
    }

    const validPaths = [['sandbox', 'staging'], ['staging', 'production']];
    const isValidPath = validPaths.some(([f, t]) => f === from && t === to);
    if (!isValidPath) {
      return NextResponse.json({ success: false, error: 'Invalid promotion path. Allowed: sandbox->staging, staging->production' }, { status: 400 });
    }

    if (from === 'staging' && to === 'production' && !featureFlags.isEnabled('ENABLE_STAGING')) {
      return NextResponse.json({ success: false, error: 'Staging is not enabled' }, { status: 400 });
    }

    const record = promote(from, to, notes);
    return NextResponse.json({ success: true, data: record });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
