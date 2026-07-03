import { NextResponse } from 'next/server';
import { featureFlags } from '../../../../../../organic-traffic-os/core/infrastructure/feature-flags';
import { getEnvironmentState } from '../../../../../../organic-traffic-os/core/infrastructure/environment/environment-state';
import { getCurrentConfig } from '../../../../../../organic-traffic-os/core/infrastructure/environment';

export async function GET() {
  const config = getCurrentConfig();
  const flags = featureFlags.getAll();
  const envState = getEnvironmentState();
  return NextResponse.json({
    success: true,
    data: {
      environment: config.name,
      domain: config.domain,
      logLevel: config.logLevel,
      metricsEnabled: config.metricsEnabled,
      featureFlags: flags,
      state: envState,
    },
  });
}
