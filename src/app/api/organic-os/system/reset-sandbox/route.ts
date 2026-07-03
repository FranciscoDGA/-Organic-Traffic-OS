import { NextResponse } from 'next/server';
import { featureFlags } from '../../../../../../organic-traffic-os/core/infrastructure/feature-flags';
import { resetSandbox } from '../../../../../../organic-traffic-os/core/infrastructure/environment/environment-state';

export async function POST() {
  if (!featureFlags.isEnabled('ENABLE_SANDBOX')) {
    return NextResponse.json({ success: false, error: 'Sandbox is not enabled' }, { status: 400 });
  }
  resetSandbox();
  return NextResponse.json({
    success: true,
    data: {
      message: 'Sandbox reset successfully',
      timestamp: new Date().toISOString(),
    },
  });
}
